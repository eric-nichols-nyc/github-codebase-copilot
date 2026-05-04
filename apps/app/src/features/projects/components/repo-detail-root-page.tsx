import { asc } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { ProjectsList } from "@/src/features/projects/components/project-list";
import { RepoDetail } from "@/src/features/projects/components/repo-detail";

export type RepoDetailRootPageProps = {
  readonly params: Promise<{ id: string }>;
  /** e.g. `/repos` or `/admin/repos` — must not include a trailing slash */
  readonly reposBasePath: "/repos" | "/admin/repos";
};

export async function RepoDetailRootPage({
  params,
  reposBasePath,
}: RepoDetailRootPageProps) {
  const { id } = await params;

  const projectRows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.githubOwner), asc(projects.githubRepo));

  const project = projectRows.find((p) => p.id === id);
  if (project === undefined) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden">
      <div className="min-h-0 min-w-0 flex-[9] overflow-y-auto overscroll-y-contain border-r p-4 lg:max-w-md lg:flex-[0_0_38%]">
        <p className="mb-4 font-medium text-sm">Projects</p>
        <ProjectsList
          activeRepoId={id}
          projects={projectRows}
          reposBasePath={reposBasePath}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-[11] flex-col overflow-hidden overscroll-y-contain p-4 lg:flex-1">
        <RepoDetail project={project} />
      </div>
    </div>
  );
}
