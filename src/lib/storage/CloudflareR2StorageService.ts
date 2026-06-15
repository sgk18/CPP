import { StorageService } from "./StorageService";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";

export class CloudflareR2StorageService implements StorageService {
  private s3: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || "";
    this.publicUrl = process.env.R2_PUBLIC_URL || "";

    if (!accountId || !accessKeyId || !secretAccessKey || !this.bucketName) {
      console.warn("Cloudflare R2 storage credentials are not fully configured in environment.");
    }

    this.s3 = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
      },
      region: "auto",
    });
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    folder?: string
  ): Promise<{
    url: string;
    original: string;
    medium: string;
    thumbnail: string;
    size: number;
    mimeType: string;
  }> {
    // 1. Validate file type
    const cleanMime = mimeType.toLowerCase();
    const cleanExt = path.extname(filename).toLowerCase();
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedMimeTypes.includes(cleanMime) && !allowedExtensions.includes(cleanExt)) {
      throw new Error("Invalid file type. Only JPEG, PNG, and WEBP images are allowed.");
    }

    // 2. Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSizeBytes) {
      throw new Error("File exceeds the maximum allowed size of 5MB.");
    }

    // Determine subfolder and naming prefix
    const cleanFolder = (folder || "general").toLowerCase().trim();

    let prefix = "general";
    if (cleanFolder === "events") {
      prefix = "event";
    } else if (cleanFolder === "gallery") {
      prefix = "gallery";
    } else if (cleanFolder === "team") {
      prefix = "team";
    } else {
      prefix = cleanFolder;
    }

    const randomHex = crypto.randomBytes(3).toString("hex");

    // Output keys adhering to instructions
    const originalKey = `${cleanFolder}/${prefix}_${randomHex}.webp`;
    const mediumKey = `${cleanFolder}/medium_${prefix}_${randomHex}.webp`;
    const thumbKey = `${cleanFolder}/thumb_${prefix}_${randomHex}.webp`;

    // 3. Compress and generate buffers using sharp
    // Original Version: WebP, quality 85, no resize
    const originalBuffer = await sharp(fileBuffer)
      .webp({ quality: 85 })
      .toBuffer();

    // Medium Version: WebP, quality 85, width 1200px (without enlargement)
    const mediumBuffer = await sharp(fileBuffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Thumbnail Version: WebP, quality 80, width 400px (without enlargement)
    const thumbBuffer = await sharp(fileBuffer)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload all 3 versions to Cloudflare R2
    const uploadVersion = async (key: string, buffer: Buffer) => {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
      });
      await this.s3.send(command);
    };

    await Promise.all([
      uploadVersion(originalKey, originalBuffer),
      uploadVersion(mediumKey, mediumBuffer),
      uploadVersion(thumbKey, thumbBuffer),
    ]);

    // Compute the public URLs
    const url = `${this.publicUrl}/${originalKey}`;
    const originalUrl = `${this.publicUrl}/${originalKey}`;
    const mediumUrl = `${this.publicUrl}/${mediumKey}`;
    const thumbUrl = `${this.publicUrl}/${thumbKey}`;

    return {
      url,
      original: originalUrl,
      medium: mediumUrl,
      thumbnail: thumbUrl,
      size: originalBuffer.length,
      mimeType: "image/webp",
    };
  }

  async delete(urlPath: string): Promise<void> {
    if (!urlPath) return;

    try {
      let pathname = "";
      if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
        const url = new URL(urlPath);
        pathname = decodeURIComponent(url.pathname);
      } else {
        pathname = decodeURIComponent(urlPath);
      }

      // Remove leading slash to get the key path
      if (pathname.startsWith("/")) {
        pathname = pathname.substring(1);
      }

      const parts = pathname.split("/");
      const filename = parts[parts.length - 1];
      if (!filename) return;

      const folderPath = parts.slice(0, -1).join("/");
      
      const ext = path.extname(filename);
      const nameWithoutExt = path.basename(filename, ext);

      const keysToDelete = [
        pathname,
        folderPath ? `${folderPath}/thumb_${filename}` : `thumb_${filename}`,
        folderPath ? `${folderPath}/medium_${filename}` : `medium_${filename}`,
        // Fallbacks for older naming convention
        folderPath ? `${folderPath}/${nameWithoutExt}-medium${ext}` : `${nameWithoutExt}-medium${ext}`,
        folderPath ? `${folderPath}/${nameWithoutExt}-thumb${ext}` : `${nameWithoutExt}-thumb${ext}`,
      ];

      const deleteKey = async (key: string) => {
        try {
          const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          });
          await this.s3.send(command);
        } catch (err) {
          console.error(`Error deleting object key from R2: ${key}`, err);
        }
      };

      await Promise.all(keysToDelete.map(deleteKey));
    } catch (err) {
      console.error(`Error deleting from R2 for: ${urlPath}`, err);
    }
  }
}
