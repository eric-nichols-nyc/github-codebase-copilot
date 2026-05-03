const TRAILING_SLASH = /\/$/;

export type ImportRepoRequestBody = {
  repoInput?: string;
  githubOwner?: string;
  githubRepo?: string;
};

export type ResolvedOwnerRepo = {
  githubOwner: string;
  githubRepo: string;
};

/**
 * Parses POST /api/repos/import JSON into owner/repo, or returns null if invalid.
 */
export function resolveImportRepoBody(
  body: ImportRepoRequestBody
): ResolvedOwnerRepo | null {
  if (
    typeof body.githubOwner === "string" &&
    typeof body.githubRepo === "string"
  ) {
    const githubOwner = body.githubOwner.trim();
    const githubRepo = body.githubRepo.trim();
    if (githubOwner.length > 0 && githubRepo.length > 0) {
      return { githubOwner, githubRepo };
    }
    return null;
  }

  if (typeof body.repoInput !== "string" || !body.repoInput.includes("/")) {
    return null;
  }

  const cleaned = body.repoInput
    .trim()
    .replace("https://github.com/", "")
    .replace("http://github.com/", "")
    .replace(TRAILING_SLASH, "");

  const [githubOwner, githubRepo] = cleaned.split("/");
  if (
    githubOwner === undefined ||
    githubRepo === undefined ||
    githubOwner.length === 0 ||
    githubRepo.length === 0
  ) {
    return null;
  }

  return { githubOwner, githubRepo };
}
