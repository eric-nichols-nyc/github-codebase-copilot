// src/features/projects/lib/github-client.ts

const GITHUB_API = "https://api.github.com";

function getHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };
}

export type GithubRepoListItem = {
  fullName: string;
  name: string;
  private: boolean;
};

/** Repositories visible to `GITHUB_TOKEN` (up to 100, recently updated first). */
export async function listGitHubUserRepos(): Promise<GithubRepoListItem[]> {
  const res = await fetch(
    `${GITHUB_API}/user/repos?per_page=100&sort=updated`,
    { headers: getHeaders() }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("GitHub token missing or invalid");
    }
    throw new Error("Failed to list repositories");
  }

  const data = (await res.json()) as Array<{
    full_name: string;
    name: string;
    private: boolean;
  }>;

  return data.map((r) => ({
    fullName: r.full_name,
    name: r.name,
    private: r.private,
  }));
}

export async function getRepo(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
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
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  // Some repos don't have a README
  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (!data.content) return null;

  // Decode base64 → string
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");

  return decoded;
}
export async function getLanguages(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
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
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  // Return simplified version
  return data.map((branch: any) => ({
    name: branch.name,
    sha: branch.commit?.sha,
  }));
}

export async function getPackageJson(owner: string, repo: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  // Many repos don't have package.json
  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (!data.content) return null;

  try {
    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    return {
      name: parsed.name,
      dependencies: parsed.dependencies || {},
      devDependencies: parsed.devDependencies || {},
    };
  } catch (err) {
    return null;
  }
}

export function extractTechStack(pkg: any) {
  if (!pkg) return [];

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  return Object.keys(deps);
}
