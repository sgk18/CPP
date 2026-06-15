import { StorageService } from "./StorageService";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export class LocalStorageService implements StorageService {
  private uploadDir: string;
  private publicPathPrefix = "/uploads";

  constructor() {
    // Target: <cwd>/public/uploads
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(subfolder?: string) {
    const targetDir = subfolder ? path.join(this.uploadDir, subfolder) : this.uploadDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
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
    const sharp = require("sharp");
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
    this.ensureUploadDirectoryExists(cleanFolder);

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

    // Output filenames adhering to instructions
    const originalFilename = `${prefix}_${randomHex}.webp`;
    const mediumFilename = `medium_${prefix}_${randomHex}.webp`;
    const thumbnailFilename = `thumb_${prefix}_${randomHex}.webp`;

    const originalDiskPath = path.join(this.uploadDir, cleanFolder, originalFilename);
    const mediumDiskPath = path.join(this.uploadDir, cleanFolder, mediumFilename);
    const thumbnailDiskPath = path.join(this.uploadDir, cleanFolder, thumbnailFilename);

    // 3. Compress and generate images using sharp
    // Original Version: WebP, quality 85, no resize
    await sharp(fileBuffer)
      .webp({ quality: 85 })
      .toFile(originalDiskPath);

    // Medium Version: WebP, quality 85, width 1200px (without enlargement)
    await sharp(fileBuffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(mediumDiskPath);

    // Thumbnail Version: WebP, quality 80, width 400px (without enlargement)
    await sharp(fileBuffer)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbnailDiskPath);

    const stats = fs.statSync(originalDiskPath);

    return {
      url: `${this.publicPathPrefix}/${cleanFolder}/${originalFilename}`,
      original: `${this.publicPathPrefix}/${cleanFolder}/${originalFilename}`,
      medium: `${this.publicPathPrefix}/${cleanFolder}/${mediumFilename}`,
      thumbnail: `${this.publicPathPrefix}/${cleanFolder}/${thumbnailFilename}`,
      size: stats.size,
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

      // Strip public path prefix
      let relPath = pathname;
      if (relPath.startsWith(this.publicPathPrefix)) {
        relPath = relPath.substring(this.publicPathPrefix.length);
      }
      if (relPath.startsWith("/")) {
        relPath = relPath.substring(1);
      }

      const parts = relPath.split("/");
      const filename = parts[parts.length - 1];
      if (!filename) return;

      const folderPath = parts.slice(0, -1).join("/");
      
      const ext = path.extname(filename);
      const nameWithoutExt = path.basename(filename, ext);

      const filesToDelete = [
        path.join(this.uploadDir, folderPath, filename),
        path.join(this.uploadDir, folderPath, `thumb_${filename}`),
        path.join(this.uploadDir, folderPath, `medium_${filename}`),
        // Fallbacks for older naming convention
        path.join(this.uploadDir, folderPath, `${nameWithoutExt}-medium${ext}`),
        path.join(this.uploadDir, folderPath, `${nameWithoutExt}-thumb${ext}`),
      ];

      for (const fullDiskPath of filesToDelete) {
        if (fs.existsSync(fullDiskPath)) {
          fs.unlinkSync(fullDiskPath);
        }
      }
    } catch (err) {
      console.error(`Error deleting files for URL path: ${urlPath}`, err);
    }
  }
}
export const storageService = new LocalStorageService();
