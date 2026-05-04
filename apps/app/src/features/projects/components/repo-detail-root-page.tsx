import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { ProjectsList } from "@/src/features/projects/components/project-list";
import { RepoDetail } from "@/src/features/projects/components/repo-detail";

export type RepoDetailRootPageProps = {
  readonly params: Promise<{ slug: string }>;
  /** e.g. `/repos` or `/admin/repos` — must not include a trailing slash */
  readonly reposBasePath: "/repos" | "/admin/repos";
};

export async function RepoDetailRootPage({
  params,
  reposBasePath,
}: RepoDetailRootPageProps) {
  const { slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam.trim());

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (project === undefined) {
    notFound();
  }

  const projectRows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.githubOwner), asc(projects.githubRepo));

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] min-h-0 w-full overflow-hidden">
      <div className="min-h-0 min-w-0 flex-[9] overflow-y-auto overscroll-y-contain border-r p-4 lg:max-w-md lg:flex-[0_0_38%]">
        <p className="mb-4 font-medium text-sm">Projects</p>
        <ProjectsList
          activeRepoSlug={slug}
          projects={projectRows}
          reposBasePath={reposBasePath}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-[11] flex-col overflow-hidden overscroll-y-contain p-4 lg:flex-1">
        <RepoDetail project={project} reposBasePath={reposBasePath} />
      </div>
    </div>
  );
}
