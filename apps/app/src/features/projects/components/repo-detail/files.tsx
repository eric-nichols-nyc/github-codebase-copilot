"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { FileText, Folder } from "lucide-react";
import type { ProjectRepoTreeJson, ProjectSelectRow } from "@/lib/db/schema";

type RepoDetailFilesProps = {
  readonly project: ProjectSelectRow;
};

/** Nested map: folder → subtree, leaf file → `null`. */
interface TreeNode {
  readonly [segment: string]: TreeNode | null;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = {};

  for (const path of paths) {
    if (path.length === 0) {
      continue;
    }
    const parts = path.split("/").filter((p) => p.length > 0);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === undefined) {
        break;
      }
      const isLeaf = i === parts.length - 1;

      if (isLeaf) {
        current[part] = null;
        break;
      }

      const existing = current[part];
      if (existing === undefined) {
        const next: TreeNode = {};
        current[part] = next;
        current = next;
      } else if (existing === null) {
        const next: TreeNode = {};
        current[part] = next;
        current = next;
      } else {
        current = existing;
      }
    }
  }

  return root;
}

function pathsFromRepoTree(repoTree: ProjectRepoTreeJson | null): string[] {
  if (repoTree === null || repoTree.length === 0) {
    return [];
  }
  return repoTree
    .filter((e) => e.type === "blob" && typeof e.path === "string")
    .map((e) => e.path);
}

type FileTreeProps = {
  readonly tree: TreeNode;
  readonly depth?: number;
  readonly maxDepth?: number;
};

function FileTree({ tree, depth = 0, maxDepth = 4 }: FileTreeProps) {
  const entries = Object.entries(tree).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="list-none space-y-0.5 border-border/60 border-l pl-3">
      {entries.map(([name, value]) => {
        const isDir = value !== null;
        const showChildren = Boolean(isDir && depth < maxDepth);
        const truncated = Boolean(isDir && depth >= maxDepth);

        let nested: React.ReactNode = null;
        if (showChildren && value !== null) {
          nested = <FileTree depth={depth + 1} maxDepth={maxDepth} tree={value} />;
        }

        let ellipsis: React.ReactNode = null;
        if (truncated && value !== null) {
          ellipsis = (
            <p className="py-0.5 pl-5 text-muted-foreground text-xs">…</p>
          );
        }

        return (
          <li className="text-sm" key={name}>
            <div className="flex items-center gap-2 py-0.5">
              {isDir ? (
                <Folder className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
              ) : (
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate font-mono text-xs">{name}</span>
            </div>
            {nested}
            {ellipsis}
          </li>
        );
      })}
    </ul>
  );
}

export function RepoDetailFiles({ project }: RepoDetailFilesProps) {
  const paths = pathsFromRepoTree(project.repoTree);
  const tree = buildTree(paths);
  const hasAny = paths.length > 0;

  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className="flex items-center gap-2 font-medium text-sm">
          <Folder className="h-4 w-4" />
          Files
          {hasAny ? (
            <span className="ml-auto font-normal text-muted-foreground text-xs tabular-nums">
              {paths.length} shown
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {hasAny ? (
          <div className="max-h-[min(28rem,calc(100dvh-14rem))] overflow-y-auto rounded-md border border-border/80 bg-muted/20 p-3">
            <FileTree maxDepth={4} tree={tree} />
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            No file tree yet. Re-import the repository to sync paths from
            GitHub.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
