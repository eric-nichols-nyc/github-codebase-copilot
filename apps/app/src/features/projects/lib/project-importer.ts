/**
 * Builds the payload for a GitHub import (parallel fetches + optional package.json).
 * For the HTTP/API and DB upsert sequence, see docs/content/docs/apps/project-import.mdx
 */
import {
  getBranches,
  getLanguages,
  getPackageJson,
  getReadme,
  getRepo,
  getRepoTree,
} from "./github-client";
import { simplifyTree } from "./repo-tree";

export type ImportProjectOptions = {
  /** Limit synced file paths to this subtree (e.g. `apps/app`) before the 500 cap. */
  treeRootPrefix?: string | null;
};

export async function importProject(
  owner: string,
  repo: string,
  options?: ImportProjectOptions
) {
  const [repoData, readme, languages, branches, packageJson] =
    await Promise.all([
      getRepo(owner, repo),
      getReadme(owner, repo),
      getLanguages(owner, repo),
      getBranches(owner, repo),
      getPackageJson(owner, repo).catch(() => null),
    ]);

  const rawTree = await getRepoTree(
    owner,
    repo,
    repoData.default_branch ?? "main"
  );
  const repoTree = simplifyTree(rawTree, {
    rootPrefix: options?.treeRootPrefix ?? null,
  });

  return {
    githubOwner: owner,
    githubRepo: repo,

    name: repoData.name,
    description: repoData.description,
    repoUrl: repoData.html_url,
    homepageUrl: repoData.homepage,

    readme,
    languages,
    branches,
    packageJson,
    repoTree,

    lastGithubUpdatedAt: repoData.updated_at
      ? new Date(repoData.updated_at)
      : null,

    githubRaw: repoData,
  };
}
