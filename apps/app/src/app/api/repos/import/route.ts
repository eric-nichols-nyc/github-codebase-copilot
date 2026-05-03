// apps/app/src/app/api/repos/import/route.ts
// Step-by-step import flow (GitHub → Neon): docs/content/docs/apps/project-import.mdx

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import {
  getBranches,
  getLanguages,
  getReadme,
  getRepo,
} from "@/src/features/projects/lib/github-client";
import {
  type ImportRepoRequestBody,
  resolveImportRepoBody,
} from "@/src/features/projects/lib/resolve-import-repo-body";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ImportRepoRequestBody;
    const parsed = resolveImportRepoBody(body);

    if (parsed === null) {
      return NextResponse.json(
        {
          error:
            "Provide githubOwner and githubRepo, or repoInput as owner/repo (e.g. vercel/next.js).",
        },
        { status: 400 }
      );
    }

    const { githubOwner, githubRepo } = parsed;

    const [repoData, readme, languages, branches] = await Promise.all([
      getRepo(githubOwner, githubRepo),
      getReadme(githubOwner, githubRepo),
      getLanguages(githubOwner, githubRepo),
      getBranches(githubOwner, githubRepo),
    ]);

    const now = new Date();

    const [project] = await db
      .insert(projects)
      .values({
        githubOwner,
        githubRepo,

        name: repoData.name,
        description: repoData.description,
        readme,
        repoUrl: repoData.html_url,
        homepageUrl: repoData.homepage,
        languages,
        branches,
        lastGithubUpdatedAt: repoData.updated_at
          ? new Date(repoData.updated_at)
          : null,
        lastSyncedAt: now,
        githubRaw: repoData,

        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [projects.githubOwner, projects.githubRepo],
        set: {
          name: repoData.name,
          description: repoData.description,
          readme,
          repoUrl: repoData.html_url,
          homepageUrl: repoData.homepage,
          languages,
          branches,
          lastGithubUpdatedAt: repoData.updated_at
            ? new Date(repoData.updated_at)
            : null,
          lastSyncedAt: now,
          githubRaw: repoData,
          updatedAt: now,
        },
      })
      .returning();

    if (project === undefined) {
      return NextResponse.json(
        { error: "Failed to persist project." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true as const,
      project: { id: project.id },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to import GitHub repo." },
      { status: 500 }
    );
  }
}
