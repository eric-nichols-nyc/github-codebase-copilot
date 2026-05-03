import type { ProjectRepoTreeJson } from "@/lib/db/schema";
import type { RepoTreeEntry } from "./github-client";

function isHeavyOrVendorPath(path: string): boolean {
  return (
    path.includes("node_modules") ||
    path.includes(".next") ||
    path.includes("dist")
  );
}

/** Normalizes DB/API prefix: no leading/trailing slashes, empty → null. */
export function normalizeRepoTreeRootPrefix(
  raw: string | null | undefined
): string | null {
  if (raw === null || raw === undefined) {
    return null;
  }
  const t = raw.trim().replace(/^\/+|\/+$/g, "");
  return t.length === 0 ? null : t;
}

function isBlobUnderRoot(path: string, root: string): boolean {
  return path === root || path.startsWith(`${root}/`);
}

export type SimplifyTreeOptions = {
  /** When set, only blobs under this path are kept (then capped). */
  rootPrefix?: string | null;
};

/** Blobs only, drop heavy build dirs, optional monorepo subtree, cap for JSONB size. */
export function simplifyTree(
  tree: RepoTreeEntry[] | null,
  options?: SimplifyTreeOptions
): ProjectRepoTreeJson | null {
  if (tree === null || tree.length === 0) {
    return null;
  }

  const root = normalizeRepoTreeRootPrefix(options?.rootPrefix ?? null);

  let blobs = tree
    .filter((item) => item.type === "blob")
    .filter((item) => !isHeavyOrVendorPath(item.path));

  if (root !== null) {
    blobs = blobs.filter((item) => isBlobUnderRoot(item.path, root));
  }

  const filtered = blobs.slice(0, 500);

  return filtered.length > 0 ? filtered : null;
}
