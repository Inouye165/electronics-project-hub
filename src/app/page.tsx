import { DashboardView } from "@/components/dashboard/dashboard-view";
import { listRecentlyUpdatedProjects } from "@/lib/repositories/project-repository";
import { summarizeProjectStatuses } from "@/lib/services/project-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const projects = await listRecentlyUpdatedProjects(4);
    return <DashboardView projects={projects} statusSummary={summarizeProjectStatuses(projects)} />;
  } catch {
    return <DashboardView projects={[]} statusSummary={[]} error="Start PostgreSQL, copy .env.example to .env, run the Prisma migration, and seed the database to load project records." />;
  }
}
