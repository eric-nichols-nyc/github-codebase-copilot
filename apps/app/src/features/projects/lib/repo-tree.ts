import type { ProjectRepoTreeJson } from "@/lib/db/schema";
import type { RepoTreeEntry } from "./github-client";

function isHeavyOrVendorPath(path: string): boolean {
  return (
    path.includes("node_modules") ||
    path.includes(".next") ||
    path.includes("dist")
  );
}

/** Blobs only, drop heavy build dirs, cap count for JSONB size. */
export function simplifyTree(
  tree: RepoTreeEntry[] | null
): ProjectRepoTreeJson | null {
  if (tree === null || tree.length === 0) {
    return null;
  }

  const filtered = tree
    .filter((item) => item.type === "blob")
    .filter((item) => !isHeavyOrVendorPath(item.path))
    .slice(0, 500);

  return filtered.length > 0 ? filtered : null;
}
