import type { ProjectSelectRow } from "@/lib/db/schema";

import { FeaturesCard } from "./features-card";

type ProjectsListProps = {
  readonly projects: readonly ProjectSelectRow[];
};

export function ProjectsList({ projects: rows }: ProjectsListProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-muted-foreground text-sm">
        No projects yet. Import a repository to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map((p) => (
        <FeaturesCard
          key={p.id}
          body={p.description ?? p.customSummary ?? "No description yet."}
          title={p.displayTitle ?? `${p.githubOwner}/${p.githubRepo}`}
        />
      ))}
    </ul>
  );
}
