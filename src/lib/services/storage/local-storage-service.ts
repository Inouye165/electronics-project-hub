import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { createHash } from "node:crypto";

import { buildOpaqueStorageKey, type StorageService, type StoreObjectInput, type StoredObjectDescriptor } from "@/lib/services/storage/storage-service";

export class LocalStorageService implements StorageService {
  constructor(private readonly rootPath = process.env.LOCAL_STORAGE_ROOT ?? "./storage/local") {}

  async storeObject(input: StoreObjectInput): Promise<StoredObjectDescriptor> {
    const storageKey = buildOpaqueStorageKey(input.projectId, input.originalName);
    const fullPath = this.resolveStorageKey(storageKey);

    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, input.bytes);

    return {
      storageKey,
      byteSize: input.bytes.byteLength,
      mimeType: input.mimeType,
      checksum: createHash("sha256").update(input.bytes).digest("hex"),
    };
  }

  async getSignedReadUrl(storageKey: string): Promise<string> {
    return `/api/files/${encodeURIComponent(storageKey)}`;
  }

  async deleteObject(): Promise<void> {
    throw new Error("Local deletion will be added with the upload workflow so audit rules stay explicit.");
  }

  private resolveStorageKey(storageKey: string): string {
    const fullPath = normalize(join(this.rootPath, storageKey));

    if (!fullPath.startsWith(normalize(this.rootPath))) {
      throw new Error("Invalid storage key.");
    }

    return fullPath;
  }
}
