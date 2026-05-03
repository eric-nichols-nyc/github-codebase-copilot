"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { FileText, Folder } from "lucide-react";
import type { ReactNode } from "react";
import type { ProjectRepoTreeJson, ProjectSelectRow } from "@/lib/db/schema";
import { normalizeRepoTreeRootPrefix } from "@/src/features/projects/lib/repo-tree";

type RepoDetailFilesProps = {
  readonly project: ProjectSelectRow;
};

/** Folder nesting shown before collapsed “…” (0 = top segment only). */
const FILE_TREE_MAX_DEPTH = 5;

/** Nested map: folder → subtree, leaf file → `null`. */
type TreeNode = {
  [segment: string]: TreeNode | null;
};

function ensureChildFolder(current: TreeNode, part: string): TreeNode {
  const existing = current[part];
  if (existing === undefined || existing === null) {
    const next: TreeNode = {};
    current[part] = next;
    return next;
  }
  return existing;
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
      if (i === parts.length - 1) {
        current[part] = null;
        break;
      }
      current = ensureChildFolder(current, part);
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

/** Keeps blobs under `root` and drops the prefix so the tree starts at that folder. */
function relativePathsUnderRoot(paths: string[], root: string | null): string[] {
  if (root === null) {
    return paths;
  }
  const prefix = `${root}/`;
  const out: string[] = [];
  for (const p of paths) {
    if (p === root) {
      out.push("");
    } else if (p.startsWith(prefix)) {
      out.push(p.slice(prefix.length));
    }
  }
  return out;
}

type FileTreeRowProps = {
  readonly depth: number;
  readonly maxDepth: number;
  readonly name: string;
  readonly value: TreeNode | null;
};

function FileTreeRow({ name, value, depth, maxDepth }: FileTreeRowProps) {
  const isDirectory = value !== null;
  const underDepthCap = depth < maxDepth;
  const showNested = isDirectory && underDepthCap;
  const showEllipsis = isDirectory && !underDepthCap;

  let nested: ReactNode = null;
  if (showNested) {
    nested = <FileTree depth={depth + 1} maxDepth={maxDepth} tree={value} />;
  }

  let ellipsis: ReactNode = null;
  if (showEllipsis) {
    ellipsis = <p className="py-0.5 pl-5 text-muted-foreground text-xs">…</p>;
  }

  return (
    <li className="text-sm">
      <div className="flex items-center gap-2 py-0.5">
        {isDirectory ? (
          <Folder className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate font-mono text-xs">{name}</span>
      </div>
      {nested !== null ? nested : null}
      {ellipsis !== null ? ellipsis : null}
    </li>
  );
}

type FileTreeProps = {
  readonly tree: TreeNode;
  readonly depth?: number;
  readonly maxDepth?: number;
};

function FileTree({
  tree,
  depth = 0,
  maxDepth = FILE_TREE_MAX_DEPTH,
}: FileTreeProps) {
  const entries = Object.entries(tree).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <ul className="list-none space-y-0.5 border-border/60 border-l pl-3">
      {entries.map(([name, value]) => (
        <FileTreeRow
          depth={depth}
          key={name}
          maxDepth={maxDepth}
          name={name}
          value={value}
        />
      ))}
    </ul>
  );
}

export function RepoDetailFiles({ project }: RepoDetailFilesProps) {
  const displayRoot = normalizeRepoTreeRootPrefix(project.repoTreeRoot);
  const allPaths = pathsFromRepoTree(project.repoTree);
  const paths = relativePathsUnderRoot(allPaths, displayRoot);
  const tree = buildTree(paths);
  const hasAny = paths.length > 0;
  const hadTree = allPaths.length > 0;
  const scopedButEmpty =
    displayRoot !== null && hadTree && paths.length === 0;

  const cardBody = (() => {
    if (scopedButEmpty) {
      return (
        <p className="text-muted-foreground text-xs">
          No files under{" "}
          <span className="font-mono text-foreground">{displayRoot}</span> in
          the synced tree. Clear the file tree root on re-import or use a path
          that exists in the repo.
        </p>
      );
    }
    if (hasAny) {
      return (
        <div className="max-h-[min(28rem,calc(100dvh-14rem))] overflow-y-auto rounded-md border border-border/80 bg-muted/20 p-3">
          <FileTree maxDepth={FILE_TREE_MAX_DEPTH} tree={tree} />
        </div>
      );
    }
    return (
      <p className="text-muted-foreground text-xs">
        No file tree yet. Re-import the repository to sync paths from GitHub.
      </p>
    );
  })();

  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 font-medium text-sm">
          <Folder className="h-4 w-4 shrink-0" />
          Files
          {displayRoot !== null ? (
            <span className="font-normal text-muted-foreground text-xs">
              ·{" "}
              <span className="font-mono text-foreground">{displayRoot}</span>
            </span>
          ) : null}
          {hasAny ? (
            <span className="ml-auto font-normal text-muted-foreground text-xs tabular-nums">
              {paths.length} shown
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">{cardBody}</CardContent>
    </Card>
  );
}
