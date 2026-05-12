import { fileMetadataSchema, imageMetadataSchema, type FileMetadataInput, type ImageMetadataInput } from "@/lib/validation/file-schemas";

export function validateProjectFileMetadata(input: FileMetadataInput): FileMetadataInput {
  return fileMetadataSchema.parse(input);
}

export function validateProjectImageMetadata(input: ImageMetadataInput): ImageMetadataInput {
  return imageMetadataSchema.parse(input);
}
