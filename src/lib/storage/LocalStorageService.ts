import { StorageService } from "./StorageService";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export class LocalStorageService implements StorageService {
  private uploadDir: string;
  private publicPathPrefix = "/uploads";

  constructor() {
    // Target: <cwd>/public/uploads
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private sanitizeFilename(filename: string): string {
    const parsed = path.parse(filename);
    const safeName = parsed.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    return `${safeName}${parsed.ext}`;
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

    this.ensureUploadDirectoryExists();

    const sanitized = this.sanitizeFilename(filename);
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const baseName = path.parse(sanitized).name;

    // Names for output images (saved as optimized WEBP)
    const originalFilename = `${uniquePrefix}-${baseName}.webp`;
    const mediumFilename = `${uniquePrefix}-${baseName}-medium.webp`;
    const thumbnailFilename = `${uniquePrefix}-${baseName}-thumb.webp`;

    const originalDiskPath = path.join(this.uploadDir, originalFilename);
    const mediumDiskPath = path.join(this.uploadDir, mediumFilename);
    const thumbnailDiskPath = path.join(this.uploadDir, thumbnailFilename);

    // 3. Compress and generate images using sharp
    const sharpInstance = sharp(fileBuffer);

    // Write original compressed webp
    await sharpInstance
      .webp({ quality: 85 })
      .toFile(originalDiskPath);

    // Write medium copy (max width 600px)
    await sharpInstance
      .resize(600, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mediumDiskPath);

    // Write thumbnail copy (max width 150px)
    await sharpInstance
      .resize(150, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbnailDiskPath);

    const stats = fs.statSync(originalDiskPath);

    return {
      url: `${this.publicPathPrefix}/${originalFilename}`,
      original: `${this.publicPathPrefix}/${originalFilename}`,
      medium: `${this.publicPathPrefix}/${mediumFilename}`,
      thumbnail: `${this.publicPathPrefix}/${thumbnailFilename}`,
      size: stats.size,
      mimeType: "image/webp",
    };
  }

  async delete(urlPath: string): Promise<void> {
    if (!urlPath || !urlPath.startsWith(this.publicPathPrefix)) {
      return;
    }

    // Extract filename from public path
    const filename = path.basename(urlPath);
    if (!filename) return;

    // Resolve filenames for medium and thumbnail
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);

    const filenamesToDelete = [
      filename,
      `${nameWithoutExt}-medium${ext}`,
      `${nameWithoutExt}-thumb${ext}`,
    ];

    for (const f of filenamesToDelete) {
      const fullDiskPath = path.join(this.uploadDir, f);
      try {
        if (fs.existsSync(fullDiskPath)) {
          fs.unlinkSync(fullDiskPath);
        }
      } catch (err) {
        console.error(`Error deleting file: ${fullDiskPath}`, err);
      }
    }
  }
}
export const storageService = new LocalStorageService();
