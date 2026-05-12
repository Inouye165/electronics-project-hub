import { z } from "zod";

export const imageVariantKinds = [
  "originalMetadata",
  "fullWebp",
  "thumbnailSmall",
  "thumbnailMedium",
  "thumbnailLarge",
] as const;

export const fileUsageContexts = [
  "project_image",
  "step_image",
  "part_image",
  "schematic",
  "pdf",
  "datasheet",
  "reference",
] as const;

export const storageProviders = ["local", "s3", "supabase", "cloudflare_r2"] as const;

const allowedDocumentMimeTypes = ["application/pdf"];
const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

export const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES ?? 10_485_760);

const baseFileMetadataSchema = z.object({
    projectId: z.string().min(1),
    stepId: z.string().min(1).optional(),
    usageContext: z.enum(fileUsageContexts),
    provider: z.enum(storageProviders).default("local"),
    storageKey: z.string().min(6).max(500),
    displayName: z.string().trim().min(1).max(180),
    originalName: z.string().trim().min(1).max(240),
    mimeType: z.string().trim().min(1),
    extension: z.string().trim().toLowerCase(),
    byteSize: z.number().int().positive().max(maxUploadBytes),
    checksum: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  });

function validateAllowedFileMetadata(value: z.infer<typeof baseFileMetadataSchema>, context: z.RefinementCtx) {
  const allowedMimeTypes = [...allowedImageMimeTypes, ...allowedDocumentMimeTypes];

  if (!allowedMimeTypes.includes(value.mimeType)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unsupported file type." });
  }

  if (!allowedExtensions.includes(value.extension)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unsupported file extension." });
  }

  if (value.mimeType.startsWith("video/")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Video files are outside this product's scope." });
  }
}

export const fileMetadataSchema = baseFileMetadataSchema.superRefine(validateAllowedFileMetadata);

export const imageMetadataSchema = baseFileMetadataSchema.extend({
  usageContext: z.enum(["project_image", "step_image", "part_image"]),
  variant: z.enum(imageVariantKinds),
  altText: z.string().trim().min(3).max(240),
  mimeType: z.literal("image/webp"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
}).superRefine(validateAllowedFileMetadata);

export type FileMetadataInput = z.infer<typeof fileMetadataSchema>;
export type ImageMetadataInput = z.infer<typeof imageMetadataSchema>;
