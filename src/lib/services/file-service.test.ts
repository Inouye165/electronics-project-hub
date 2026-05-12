import { describe, expect, it } from "vitest";

import { validateProjectFileMetadata, validateProjectImageMetadata } from "@/lib/services/file-service";

describe("file metadata validation", () => {
  it("rejects video files before storage", () => {
    expect(() =>
      validateProjectFileMetadata({
        projectId: "project-1",
        usageContext: "reference",
        provider: "local",
        storageKey: "projects/project-1/file.mp4",
        displayName: "Bench clip",
        originalName: "bench.mp4",
        mimeType: "video/mp4",
        extension: ".mp4",
        byteSize: 1000,
      }),
    ).toThrow();
  });

  it("accepts a generated WebP thumbnail variant", () => {
    expect(
      validateProjectImageMetadata({
        projectId: "project-1",
        usageContext: "project_image",
        provider: "local",
        storageKey: "projects/project-1/thumb.webp",
        displayName: "Continuity tester thumbnail",
        originalName: "tester.png",
        mimeType: "image/webp",
        extension: ".webp",
        byteSize: 42000,
        width: 640,
        height: 480,
        variant: "thumbnailMedium",
        altText: "Continuity tester on the workbench",
      }),
    ).toMatchObject({ variant: "thumbnailMedium" });
  });
});
