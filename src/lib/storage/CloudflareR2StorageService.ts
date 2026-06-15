import { StorageService } from "./StorageService";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{
    url: string;
    original: string;
    medium: string;
    thumbnail: string;
    size: number;
    mimeType: string;
  }> {
    // 1. Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
    }

    // 2. Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSizeBytes) {
      throw new Error("File exceeds the maximum allowed size of 5MB.");
    }

    const sanitized = this.sanitizeFilename(filename);
    const uniqueKey = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitized}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueKey,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.s3.send(command);

    // Compute the public URL
    const url = `${this.publicUrl}/${uniqueKey}`;

    return {
      url,
      original: url,
      medium: url,
      thumbnail: url,
      size: fileBuffer.length,
      mimeType,
    };
  }

  async delete(urlPath: string): Promise<void> {
    if (!urlPath) return;

    try {
      const url = new URL(urlPath);
      // Remove leading slash to get the exact object key
      const key = decodeURIComponent(url.pathname.substring(1));

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3.send(command);
    } catch (err) {
      console.error(`Error deleting from R2: ${urlPath}`, err);
    }
  }
}
