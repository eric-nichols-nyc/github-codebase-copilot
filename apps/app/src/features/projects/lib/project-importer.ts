import {
  getBranches,
  getLanguages,
  getPackageJson,
  getReadme,
  getRepo,
} from "./github-client";

export async function importProject(owner: string, repo: string) {
  const repoData = await getRepo(owner, repo);
  const readme = await getReadme(owner, repo);
  const languages = await getLanguages(owner, repo);
  const branches = await getBranches(owner, repo);
  const packageJson = await getPackageJson(owner, repo).catch(() => null);

  return {
    owner,
    repo,
    name: repoData.name,
    description: repoData.description,
    repoUrl: repoData.html_url,
    homepageUrl: repoData.homepage,
    readme,
    languages,
    branches,
    packageJson,
    lastGithubUpdatedAt: repoData.updated_at,
    githubRaw: repoData,
  };
}
