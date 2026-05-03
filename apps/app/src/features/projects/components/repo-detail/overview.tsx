import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  AlertCircle,
  Calendar,
  GitBranch,
  GitFork,
  RefreshCw,
  Star,
} from "lucide-react";
import type { ProjectSelectRow } from "@/lib/db/schema";
import {
  formatDate,
  formatRelativeTime,
  githubNumber,
  githubString,
  languageColors,
  normalizeBranches,
} from "./utils";

type RepoDetailOverviewProps = {
  readonly project: ProjectSelectRow;
};

export function RepoDetailOverview({ project }: RepoDetailOverviewProps) {
  const languages = project.languages ?? {};
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const branches = normalizeBranches(project.branches);
  const defaultBranch = githubString(project.githubRaw, "default_branch");
  const stars = githubNumber(project.githubRaw, "stargazers_count");
  const forks = githubNumber(project.githubRaw, "forks_count");
  const issues = githubNumber(project.githubRaw, "open_issues_count");

  return (
    <div className="space-y-4">
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
            <div className="max-h-40 space-y-1 overflow-y-auto">
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
    </div>
  );
}
