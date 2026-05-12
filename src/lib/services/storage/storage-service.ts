export interface StoredObjectDescriptor {
  storageKey: string;
  byteSize: number;
  mimeType: string;
  checksum?: string;
}

export interface StoreObjectInput {
  projectId: string;
  originalName: string;
  mimeType: string;
  bytes: Uint8Array;
}

export interface StorageService {
  storeObject(input: StoreObjectInput): Promise<StoredObjectDescriptor>;
  getSignedReadUrl(storageKey: string): Promise<string>;
  deleteObject(storageKey: string): Promise<void>;
}

export function buildOpaqueStorageKey(projectId: string, fileName: string): string {
  const cleanedName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
  return `projects/${projectId}/${crypto.randomUUID()}-${cleanedName}`;
}
