import { asc, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

/** List projects from Neon. Filter with `?owner=<githubLogin>` (case-insensitive, like GitHub). */
export async function GET(request: Request) {
  const owner = new URL(request.url).searchParams.get("owner")?.trim();

  const cols = {
    id: projects.id,
    githubOwner: projects.githubOwner,
    githubRepo: projects.githubRepo,
    displayTitle: projects.displayTitle,
    name: projects.name,
    repoUrl: projects.repoUrl,
  };

  const rows = owner
    ? await db
        .select(cols)
        .from(projects)
        .where(
          sql`lower(${projects.githubOwner}) = ${owner.toLowerCase()}`,
        )
        .orderBy(asc(projects.githubRepo))
    : await db
        .select(cols)
        .from(projects)
        .orderBy(
          asc(projects.githubOwner),
          asc(projects.githubRepo),
        );

  const projectsForDropdown = rows.map((row) => ({
    ...row,
    label:
      row.displayTitle?.trim() ||
      row.name?.trim() ||
      `${row.githubOwner}/${row.githubRepo}`,
    value: row.id,
  }));

  return Response.json({ projects: projectsForDropdown });
}
