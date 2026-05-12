# Electronics Project Hub

Electronics Project Hub is a production-minded MVP for documenting electronics projects from the first idea through the final lessons learned. The first release focuses on Projects while the database and service architecture are ready for Inventory, Lessons / Reference Library, file storage, cloud deployment, and future authentication.

The app intentionally does not implement video upload, editing, storage, or playback. It stores written tutorial notes that can help with a future tutorial workflow.

## Stack

- Next.js App Router with React and TypeScript
- Prisma ORM with PostgreSQL
- Zod for server-side input validation
- Vitest and React Testing Library for focused regression coverage
- Service and repository layers that keep data access and business rules out of React components

## Local Setup

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d postgres
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

If you already have PostgreSQL running, update `DATABASE_URL` in `.env` instead of using Docker Compose.

## Start All Local Servers

For normal local development, start the PostgreSQL server first, then run the Next.js app server:

```powershell
docker compose up -d postgres
npm run dev
```

The app runs at `http://localhost:3000`. PostgreSQL listens on `localhost:5432` using the credentials in `.env.example` unless you change `DATABASE_URL`.

On a fresh checkout, run the database setup once before starting the app:

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d postgres
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

If `docker compose up -d postgres` fails on Windows, start Docker Desktop and rerun the command. If you prefer a separately installed PostgreSQL server, keep Docker stopped and point `DATABASE_URL` in `.env` at that database instead.

## Environment Variables

Use `.env.example` as the source of truth for required local configuration.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `APP_BASE_URL` | Local or deployed app URL. |
| `STORAGE_PROVIDER` | Current storage backend. The MVP includes the local provider contract. |
| `LOCAL_STORAGE_ROOT` | Local path for development file storage. This path is ignored by git. |
| `MAX_UPLOAD_BYTES` | Maximum file size allowed by metadata validation. |

Do not commit `.env` or deployment secrets. Production secrets should live in the hosting platform or secret manager.

## Development Commands

```powershell
npm run dev              # Start Next.js locally
npm run build            # Production build check
npm run lint             # ESLint
npm run typecheck        # Strict TypeScript check
npm test                 # Vitest unit/component tests
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create/apply a local migration
npm run prisma:deploy    # Apply committed migrations in deployment
npm run seed             # Load realistic local sample records
```

## Database and Migrations

The Prisma schema lives in `prisma/schema.prisma`. PostgreSQL is the primary database target from the start.

The first schema includes:

- `User`
- `Project`
- `ProjectStep`
- `InventoryItem`
- `Lesson`
- `ReferenceLink`
- `ProjectFile`
- `ProjectImage`
- `ProjectPart`
- `Tag`
- `ProjectTag`

Use local development migrations with:

```powershell
npm run prisma:migrate -- --name descriptive_change_name
```

Use deployment migrations with:

```powershell
npm run prisma:deploy
```

This keeps schema changes explicit and avoids runtime schema drift.

## Architecture Notes

The app is structured around clear boundaries:

- `src/app` contains routes and server components.
- `src/components` contains focused UI components.
- `src/lib/repositories` contains Prisma data access.
- `src/lib/services` contains business rules and orchestration.
- `src/lib/validation` contains Zod schemas for input and metadata validation.
- `src/lib/security` contains text sanitization helpers.

React components should render data and handle interaction. They should not own persistence rules, ordering logic, upload validation, or sanitization.

Project pages currently load records from the database through repository functions. If the database is unavailable, the UI shows clear setup guidance instead of failing with a blank screen.

## File and Image Storage

File storage is behind the `StorageService` interface in `src/lib/services/storage`. The first implementation is local-development oriented, but records store provider names and opaque storage keys so the app can move to S3, Supabase Storage, Cloudflare R2, or another object store later.

The database stores metadata, not raw blobs:

- storage key
- provider
- mime type
- file extension
- byte size
- checksum
- dimensions
- usage context
- image variant

Browser-display images should be converted to WebP by the future upload pipeline. Planned variants are:

- `originalMetadata`
- `fullWebp`
- `thumbnailSmall`
- `thumbnailMedium`
- `thumbnailLarge`

The current validation rejects unsupported file types and video files before storage.

## Security Notes

- Server input is validated with Zod.
- User-provided text is sanitized before persistence in service functions.
- File metadata validation checks mime type, extension, byte size, dimensions, usage context, and explicitly rejects video.
- Server file paths are not exposed to the browser. Storage keys are opaque and read URLs are provided through the storage abstraction.
- Future authentication is planned through `User` and ownership fields without blocking the MVP.

## Testing Strategy

The MVP avoids over-testing static markup. Tests focus on areas that are likely to regress:

- Project validation and URL-safe slugs
- Project creation sanitization and repository boundaries
- Project step ordering
- File and image metadata validation
- Dashboard rendering
- Project detail rendering

Run the suite with:

```powershell
npm test
```

## Roadmap

Near-term:

- Project create/edit forms using the existing validation and service layer
- Project step editing and reordering UI
- File upload endpoint with image conversion and thumbnail generation
- Inventory list/detail screens backed by `InventoryItem`
- Lessons library search and linking to project records

Later:

- Authentication and per-user project ownership
- Cloud object storage provider
- Deployment pipeline and managed PostgreSQL
- Richer project exports for printing or family handoff
- Tag filtering and reference discovery
