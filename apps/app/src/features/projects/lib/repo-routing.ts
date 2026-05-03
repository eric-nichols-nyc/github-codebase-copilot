/**
 * Returns the detail URL for the first project in display order, or null if none.
 */
export function firstRepoDetailHref(
  orderedProjects: readonly { id: string }[]
): string | null {
  const first = orderedProjects[0];
  if (first === undefined) {
    return null;
  }
  return `/repos/${first.id}`;
}
