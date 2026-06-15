export interface StorageService {
  upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{
    url: string;         // Primary URL for display (original)
    original: string;    // Path to original image
    medium: string;      // Path to medium optimized image
    thumbnail: string;   // Path to thumbnail image
    size: number;        // File size in bytes
    mimeType: string;    // MIME type of the uploaded file
  }>;
  delete(path: string): Promise<void>;
}
