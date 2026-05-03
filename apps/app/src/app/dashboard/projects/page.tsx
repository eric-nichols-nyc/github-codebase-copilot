import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export default async function ProjectsPage() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.githubOwner), asc(projects.githubRepo));

  console.log("[projects page] loaded from database:", rows);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-semibold text-2xl tracking-tight">Projects</h1>
      <p className="text-muted-foreground text-sm">
        Import a repository from the header using{" "}
        <span className="font-medium text-foreground">Import repository</span>.
      </p>
    </div>
  );
}
