import { LocalStorageService } from "./LocalStorageService";
import { CloudflareR2StorageService } from "./CloudflareR2StorageService";
import { StorageService } from "./StorageService";

// Determine which storage provider to use
const useR2 = !!(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

export const storageService: StorageService = useR2
  ? new CloudflareR2StorageService()
  : new LocalStorageService();
