/** URL-safe unique-ish slug from GitHub owner + repo (stable across re-imports). */
export function slugFromGitHubRepo(owner: string, repo: string): string {
  const part = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const o = part(owner);
  const r = part(repo);
  return o && r ? `${o}--${r}` : `project-${crypto.randomUUID().slice(0, 12)}`;
}
