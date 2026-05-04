/**
 * Returns the detail URL for the first project in display order, or null if none.
 *
 * @param basePath - e.g. `/repos` (default) or `/admin/repos`
 */
export function firstRepoDetailHref(
  orderedProjects: readonly { id: string }[],
  basePath: "/repos" | "/admin/repos" = "/repos"
): string | null {
  const first = orderedProjects[0];
  if (first === undefined) {
    return null;
  }
  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return `${base}/${first.id}`;
}
