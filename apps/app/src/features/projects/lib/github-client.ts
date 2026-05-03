// src/features/projects/lib/github-client.ts

const GITHUB_API = "https://api.github.com";

/** GitHub rejects requests without a valid User-Agent (often 403). */
const DEFAULT_USER_AGENT =
  "github-codebase-copilot/1.0 (+https://github.com/github-codebase-copilot)";

function githubToken(): string | undefined {
  const raw = process.env.GITHUB_TOKEN ?? process.env.GITHUB_ACCESS_TOKEN;
  if (typeof raw !== "string") {
    return;
  }
  const t = raw.trim();
  if (t.length === 0) {
    return;
  }
  return t;
}

export function githubApiHeaders(): Record<string, string> {
  const token = githubToken();
  const ua =
    typeof process.env.GITHUB_API_USER_AGENT === "string" &&
    process.env.GITHUB_API_USER_AGENT.trim() !== ""
      ? process.env.GITHUB_API_USER_AGENT.trim()
      : DEFAULT_USER_AGENT;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": ua,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type GithubRepoListItem = {
  fullName: string;
  name: string;
  private: boolean;
};

function nonArrayGitHubErrorMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string") {
      return m;
    }
  }
  return "Expected a JSON array from GitHub.";
}

function tryMapUserRepoRow(row: unknown): GithubRepoListItem | null {
  if (typeof row !== "object" || row === null) {
    return null;
  }
  const r = row as {
    full_name?: unknown;
    name?: unknown;
    private?: unknown;
  };
  if (
    typeof r.full_name !== "string" ||
    typeof r.name !== "string" ||
    typeof r.private !== "boolean"
  ) {
    return null;
  }
  return {
    fullName: r.full_name,
    name: r.name,
    private: r.private,
  };
}

/**
 * Maps GitHub `GET /user/repos` JSON (array of repo objects) into list items.
 * @throws If the payload is not a JSON array (e.g. rate-limit error object).
 */
export function mapGitHubUserReposResponse(
  data: unknown
): GithubRepoListItem[] {
  if (!Array.isArray(data)) {
    throw new Error(nonArrayGitHubErrorMessage(data));
  }

  const out: GithubRepoListItem[] = [];
  for (const row of data) {
    const item = tryMapUserRepoRow(row);
    if (item !== null) {
      out.push(item);
    }
  }
  if (data.length > 0 && out.length === 0) {
    throw new Error(
      "GitHub returned repositories but none matched the expected shape (full_name, name, private)."
    );
  }
  return out;
}

/** Repositories visible to `GITHUB_TOKEN` (up to 100, recently updated first). */
export async function listGitHubUserRepos(): Promise<GithubRepoListItem[]> {
  if (githubToken() === undefined) {
    throw new Error(
      "GITHUB_TOKEN is not set (or is empty). Add it to apps/app/.env.local."
    );
  }

  const res = await fetch(
    `${GITHUB_API}/user/repos?per_page=100&sort=updated`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("GitHub token missing or invalid");
    }
    throw new Error("Failed to list repositories");
  }

  const data: unknown = await res.json();
  return mapGitHubUserReposResponse(data);
}

export async function getRepo(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: githubApiHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Repository not found");
    }

    throw new Error("Failed to fetch repository");
  }

  const data = await res.json();

  return {
    name: data.name,
    description: data.description,
    html_url: data.html_url,
    homepage: data.homepage,
    updated_at: data.updated_at,
    default_branch: data.default_branch,
    stargazers_count: data.stargazers_count,
    forks_count: data.forks_count,
    open_issues_count: data.open_issues_count,
  };
}

export async function getReadme(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  // Some repos don't have a README
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { content?: string };

  if (!data.content) {
    return null;
  }

  // Decode base64 → string
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");

  return decoded;
}
export async function getLanguages(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data; // keep raw for now
}

export async function getBranches(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as Array<{
    name?: string;
    commit?: { sha?: string };
  }>;

  return data.map((branch) => ({
    name: branch.name ?? "",
    sha: branch.commit?.sha,
  }));
}

export async function getPackageJson(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  // Many repos don't have package.json
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { content?: string };

  if (!data.content) {
    return null;
  }

  try {
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as {
      name?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    return {
      name: parsed.name,
      dependencies: parsed.dependencies ?? {},
      devDependencies: parsed.devDependencies ?? {},
    };
  } catch {
    return null;
  }
}

type PackageJsonDeps = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function extractTechStack(pkg: PackageJsonDeps | null | undefined) {
  if (!pkg) {
    return [];
  }

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  return Object.keys(deps);
}

export type RepoTreeEntry = {
  path: string;
  type: string;
  size?: number;
};

export async function getRepoTree(
  owner: string,
  repo: string,
  branch = "main"
): Promise<RepoTreeEntry[] | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    {
      headers: githubApiHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    tree?: Array<{ path?: string; type?: string; size?: number }>;
  };

  if (!Array.isArray(data.tree)) {
    return null;
  }

  return data.tree.map((item) => ({
    path: item.path ?? "",
    type: item.type ?? "",
    ...(typeof item.size === "number" ? { size: item.size } : {}),
  }));
}
