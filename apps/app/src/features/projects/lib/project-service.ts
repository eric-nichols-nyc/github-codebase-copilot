import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function createProjectFromGithub(data: any) {
  const now = new Date();

  const [project] = await db
    .insert(projects)
    .values({
      githubOwner: data.githubOwner,
      githubRepo: data.githubRepo,

      name: data.name,
      description: data.description,
      readme: data.readme,
      repoUrl: data.repoUrl,
      homepageUrl: data.homepageUrl,
      languages: data.languages,
      branches: data.branches,
      githubRaw: data.githubRaw,
      lastGithubUpdatedAt: data.lastGithubUpdatedAt,
      lastSyncedAt: now,

      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [projects.githubOwner, projects.githubRepo],
      set: {
        name: data.name,
        description: data.description,
        readme: data.readme,
        repoUrl: data.repoUrl,
        homepageUrl: data.homepageUrl,
        languages: data.languages,
        branches: data.branches,
        githubRaw: data.githubRaw,
        lastGithubUpdatedAt: data.lastGithubUpdatedAt,
        lastSyncedAt: now,
        updatedAt: now,
      },
    })
    .returning();

  return project;
}
