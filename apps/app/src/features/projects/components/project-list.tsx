import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import type { ProjectSelectRow } from "@/lib/db/schema";

import { RepoCard } from "./repo-card";

type ProjectsListProps = {
  readonly projects: readonly ProjectSelectRow[];
  /** When set, each row links to `/repos/{id}` and the active id is highlighted. */
  readonly activeRepoId?: string;
};

export function ProjectsList({
  projects: rows,
  activeRepoId,
}: ProjectsListProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center text-muted-foreground text-sm">
        No projects yet. Import a repository to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map((p) => {
        const card = (
          <RepoCard
            createdAt={p.createdAt}
            title={p.displayTitle ?? `${p.githubOwner}/${p.githubRepo}`}
          />
        );
        const isActive = activeRepoId === p.id;
        return (
          <li key={p.id}>
            <Link
              className={cn(
                "block rounded-lg outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "ring-2 ring-ring" : null
              )}
              href={`/repos/${p.id}`}
            >
              {card}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
