import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { firstRepoDetailHref } from "@/src/features/projects/lib/repo-routing";

export default async function ReposIndexPage() {
  const projectRows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .orderBy(asc(projects.githubOwner), asc(projects.githubRepo));

  const href = firstRepoDetailHref(projectRows);
  if (href !== null) {
    redirect(href);
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center p-8">
      <p className="max-w-md text-center font-medium text-lg">
        No projects to display
      </p>
    </div>
  );
}
