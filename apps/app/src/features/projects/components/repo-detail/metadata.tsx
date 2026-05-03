import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { ProjectSelectRow } from "@/lib/db/schema";
import { formatDate, formatRelativeTime } from "./utils";

type RepoDetailMetadataProps = {
  readonly project: ProjectSelectRow;
};

function MetaRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="shrink-0 text-muted-foreground text-xs">{label}</span>
      <span className="min-w-0 break-all text-foreground text-sm">{value}</span>
    </div>
  );
}

function ChipList({
  label,
  items,
}: {
  readonly label: string;
  readonly items: string[];
}) {
  if (items.length === 0) {
    return null;
  }
  const unique = [...new Set(items)];
  return (
    <div className="py-2">
      <p className="mb-1.5 text-muted-foreground text-xs">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {unique.map((item) => (
          <Badge key={`${label}:${item}`} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function RepoDetailMetadata({ project }: RepoDetailMetadataProps) {
  const tags = project.tags ?? [];
  const tech = project.techStack ?? [];
  const apis = project.apisUsed ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-3 pt-3 pb-2">
          <CardTitle className="font-medium text-sm">Record</CardTitle>
        </CardHeader>
        <CardContent className="divide-y px-3 pb-1">
          <MetaRow label="ID" value={project.id} />
          <MetaRow
            label="GitHub"
            value={`${project.githubOwner}/${project.githubRepo}`}
          />
          <MetaRow label="Created" value={formatDate(project.createdAt)} />
          <MetaRow label="Updated" value={formatDate(project.updatedAt)} />
          <MetaRow
            label="Last synced"
            value={formatRelativeTime(project.lastSyncedAt)}
          />
          <MetaRow
            label="Last GitHub update"
            value={formatRelativeTime(project.lastGithubUpdatedAt)}
          />
          <MetaRow label="Featured" value={project.featured ? "Yes" : "No"} />
          {project.homepageUrl ? (
            <MetaRow label="Homepage" value={project.homepageUrl} />
          ) : null}
          {project.repoUrl ? (
            <MetaRow label="Repository URL" value={project.repoUrl} />
          ) : null}
          {project.imageUrl ? (
            <MetaRow label="Image URL" value={project.imageUrl} />
          ) : null}
        </CardContent>
      </Card>

      {(tags.length > 0 || tech.length > 0 || apis.length > 0) && (
        <Card>
          <CardHeader className="px-3 pt-3 pb-2">
            <CardTitle className="font-medium text-sm">Taxonomy</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <ChipList items={tech} label="Tech stack" />
            <ChipList items={apis} label="APIs used" />
            <ChipList items={tags} label="Tags" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
