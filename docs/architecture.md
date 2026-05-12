# Architecture Notes

## Product Shape

Projects are the primary MVP workflow. Inventory and Lessons are visible in the app and represented in the schema, but their full CRUD experiences are intentionally deferred so the first release stays useful and focused.

The project journal model is meant to preserve the full build story: goal, motivation, problem solved, parts, lessons, mistakes, fixes, safety notes, future tutorial notes, and ordered build steps.

## Data Boundary

Prisma is isolated under `src/lib/repositories`. React components should not import the Prisma client directly. Server routes and pages can call repositories or services, but persistence details stay out of UI components.

Services in `src/lib/services` handle validation, sanitization, business rules, and ordering. This is where project creation, project updates, step ordering, and file metadata registration should continue to grow.

## Validation Boundary

Zod schemas live in `src/lib/validation`. Client-side validation can be added later for better UX, but server-side validation remains the source of truth.

File validation deliberately checks both mime type and extension. Browser display images are expected to become WebP variants before they are attached to projects for normal viewing.

## Storage Boundary

The app stores metadata in PostgreSQL and bytes in object storage. Local storage is only the first provider. Cloud providers should implement the same `StorageService` interface and return opaque read URLs rather than exposing internal paths.

The application should never depend on whether a file lives on disk, in S3, in Supabase Storage, or in Cloudflare R2.

## Deferred Authentication

The `User` model and optional project ownership are present so authentication can be added later without remapping project records. Until auth exists, seeded records use a local development owner.

## Explicit Non-Goal

Video upload, video editing, video storage, and video playback are outside the product scope. Project and step records support written tutorial notes only.
