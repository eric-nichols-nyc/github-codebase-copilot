const TRAILING_SLASH = /\/$/;
const LEADING_TRAILING_SLASHES = /^\/+|\/+$/g;

export type ImportRepoRequestBody = {
  repoInput?: string;
  githubOwner?: string;
  githubRepo?: string;
  /** Optional monorepo subfolder; only paths under this prefix appear in Files. */
  repoTreeRoot?: string | null;
};

export type ResolvedOwnerRepo = {
  githubOwner: string;
  githubRepo: string;
  /** `undefined` = do not change existing `repo_tree_root` on re-import. */
  repoTreeRoot: string | null | undefined;
};

function parseRepoTreeRootFromBody(
  body: ImportRepoRequestBody
): string | null | undefined {
  if (!("repoTreeRoot" in body)) {
    return undefined;
  }
  const raw = body.repoTreeRoot;
  if (raw === null) {
    return null;
  }
  if (typeof raw !== "string") {
    return null;
  }
  const t = raw.trim().replace(LEADING_TRAILING_SLASHES, "");
  return t.length === 0 ? null : t;
}

/**
 * Parses POST /api/repos/import JSON into owner/repo, or returns null if invalid.
 */
export function resolveImportRepoBody(
  body: ImportRepoRequestBody
): ResolvedOwnerRepo | null {
  const repoTreeRoot = parseRepoTreeRootFromBody(body);

  if (
    typeof body.githubOwner === "string" &&
    typeof body.githubRepo === "string"
  ) {
    const githubOwner = body.githubOwner.trim();
    const githubRepo = body.githubRepo.trim();
    if (githubOwner.length > 0 && githubRepo.length > 0) {
      return { githubOwner, githubRepo, repoTreeRoot };
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

  return { githubOwner, githubRepo, repoTreeRoot };
}
