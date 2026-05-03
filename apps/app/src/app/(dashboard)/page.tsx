import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { ProjectDetail } from "@/src/features/projects/components/project-detail";
import { ProjectsList } from "@/src/features/projects/components/project-list";

export default async function DashboardHomePage() {
  const projectRows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.githubOwner), asc(projects.githubRepo));

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden">
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain border-r p-4">
        <p className="mb-4 font-medium text-sm">Projects</p>
        <ProjectsList projects={projectRows} />
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain p-4">
        <ProjectDetail />
      </div>
    </div>
  );
}
