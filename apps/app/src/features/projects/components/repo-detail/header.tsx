import { Badge } from "@repo/design-system/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { ProjectSelectRow } from "@/lib/db/schema";

type RepoDetailHeaderProps = {
  readonly project: ProjectSelectRow;
};

export function RepoDetailHeader({ project }: RepoDetailHeaderProps) {
  const title =
    project.displayTitle ??
    project.name ??
    `${project.githubOwner}/${project.githubRepo}`;

  return (
    <div className="shrink-0 space-y-2 border-b pb-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-foreground text-xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {project.githubOwner}/{project.githubRepo}
          </p>
        </div>
        {project.featured ? (
          <Badge className="shrink-0" variant="secondary">
            Featured
          </Badge>
        ) : null}
      </div>

      {project.description ? (
        <p className="text-muted-foreground text-sm">{project.description}</p>
      ) : null}

      {project.repoUrl ? (
        <a
          className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          href={project.repoUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          View on GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
    </div>
  );
}
