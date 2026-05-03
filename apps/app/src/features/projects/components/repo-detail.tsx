"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Separator } from "@repo/design-system/components/ui/separator";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  GitBranch,
  GitFork,
  RefreshCw,
  Star,
} from "lucide-react";
import type {
  ProjectBranchesJson,
  ProjectGithubRawJson,
  ProjectSelectRow,
} from "@/lib/db/schema";

type RepoDetailProps = {
  readonly project: ProjectSelectRow;
};

type BranchRow = {
  readonly name: string;
  readonly sha: string;
};

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  CSS: "bg-purple-500",
  HTML: "bg-orange-500",
  Shell: "bg-green-500",
  Handlebars: "bg-amber-600",
};

function githubNumber(raw: ProjectGithubRawJson | null, key: string): number {
  const v = raw?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function githubString(raw: ProjectGithubRawJson | null, key: string): string {
  const v = raw?.[key];
  return typeof v === "string" ? v : "";
}

function branchShaFromRecord(o: Record<string, unknown>): string {
  if (typeof o.sha === "string") {
    return o.sha;
  }
  const commit = o.commit;
  if (typeof commit !== "object" || commit === null) {
    return "";
  }
  const sha = (commit as Record<string, unknown>).sha;
  return typeof sha === "string" ? sha : "";
}

function parseBranchItem(item: unknown, index: number): BranchRow | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }
  const o = item as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name : "";
  const sha = branchShaFromRecord(o);
  if (name === "" && sha === "") {
    return null;
  }
  return { name, sha: sha !== "" ? sha : `row-${index}` };
}

function normalizeBranches(raw: ProjectBranchesJson | null): BranchRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: BranchRow[] = [];
  for (let i = 0; i < raw.length; i++) {
    const row = parseBranchItem(raw[i], i);
    if (row !== null) {
      out.push(row);
    }
  }
  return out;
}

function formatDate(value: Date | string | null | undefined): string {
  if (value === undefined || value === null) {
    return "—";
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(value: Date | string | null | undefined): string {
  if (value === undefined || value === null) {
    return "—";
  }
  const date = value instanceof Date ? value : new Date(value);
  const t = date.getTime();
  if (Number.isNaN(t)) {
    return "—";
  }
  const now = Date.now();
  const diffMs = now - t;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return formatDate(value);
}

export function RepoDetail({ project }: RepoDetailProps) {
  const languages = project.languages ?? {};
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const branches = normalizeBranches(project.branches);
  const defaultBranch = githubString(project.githubRaw, "default_branch");
  const stars = githubNumber(project.githubRaw, "stargazers_count");
  const forks = githubNumber(project.githubRaw, "forks_count");
  const issues = githubNumber(project.githubRaw, "open_issues_count");

  const title =
    project.displayTitle ??
    project.name ??
    `${project.githubOwner}/${project.githubRepo}`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
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

      <Separator />

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="font-semibold text-lg">{stars}</p>
              <p className="text-muted-foreground text-xs">Stars</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-semibold text-lg">{forks}</p>
              <p className="text-muted-foreground text-xs">Forks</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-semibold text-lg">{issues}</p>
              <p className="text-muted-foreground text-xs">Issues</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-3 pt-3 pb-2">
          <CardTitle className="font-medium text-sm">Languages</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {totalBytes > 0 ? (
            <div className="space-y-2">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                {Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lang, bytes]) => (
                    <div
                      className={languageColors[lang] ?? "bg-gray-400"}
                      key={lang}
                      style={{ width: `${(bytes / totalBytes) * 100}%` }}
                    />
                  ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lang, bytes]) => (
                    <div
                      className="flex items-center gap-1.5 text-xs"
                      key={lang}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${languageColors[lang] ?? "bg-gray-400"}`}
                      />
                      <span className="text-foreground">{lang}</span>
                      <span className="text-muted-foreground">
                        {((bytes / totalBytes) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              No language data yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 pt-3 pb-2">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <GitBranch className="h-4 w-4" />
            Branches
            <Badge className="ml-auto text-xs" variant="outline">
              {branches.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {branches.length > 0 ? (
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {branches.map((branch) => (
                <div
                  className="flex items-center justify-between py-1 text-xs"
                  key={`${branch.sha}-${branch.name}`}
                >
                  <span
                    className={
                      branch.name === defaultBranch
                        ? "truncate font-medium text-foreground"
                        : "truncate text-muted-foreground"
                    }
                  >
                    {branch.name || "(unnamed)"}
                  </span>
                  {branch.name === defaultBranch && defaultBranch !== "" ? (
                    <Badge
                      className="px-1.5 py-0 text-[10px]"
                      variant="secondary"
                    >
                      default
                    </Badge>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              No branches loaded yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 pt-3 pb-2">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <Calendar className="h-4 w-4" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Last GitHub update</span>
            <span className="text-foreground">
              {formatRelativeTime(project.lastGithubUpdatedAt)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Last synced</span>
            <span className="flex items-center gap-1 text-foreground">
              <RefreshCw className="h-3 w-3" />
              {formatRelativeTime(project.lastSyncedAt)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">
              {formatDate(project.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      {project.readme ? (
        <Card>
          <CardHeader className="px-3 pt-3 pb-2">
            <CardTitle className="font-medium text-sm">README</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="line-clamp-6 whitespace-pre-wrap rounded bg-muted/50 p-2 font-mono text-muted-foreground text-xs">
              {project.readme}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
