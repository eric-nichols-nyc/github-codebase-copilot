import "server-only";

import { Buffer } from "node:buffer";

const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
  };
}

export type GithubRepoListItem = {
  fullName: string;
  name: string;
  private: boolean;
};

export async function listUserRepos(): Promise<GithubRepoListItem[]> {
  const url = new URL(`${GITHUB_API}/user/repos`);
  url.searchParams.set("per_page", "100");
  url.searchParams.set("sort", "updated");
  const res = await fetch(url.toString(), { headers: githubHeaders() });

  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status})`);
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
    headers: githubHeaders(),
  });

  if (!res.ok) {
    throw new Error("Repo not found");
  }

  return res.json();
}

export async function getReadme(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
    headers: githubHeaders(),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { content?: string };

  if (!data.content) {
    return null;
  }

  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function getLanguages(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
    headers: githubHeaders(),
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function getBranches(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/branches`, {
    headers: githubHeaders(),
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
