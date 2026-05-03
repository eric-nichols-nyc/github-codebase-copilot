// apps/app/src/app/api/repos/import/route.ts
// Step-by-step import flow (GitHub → Neon): docs/content/docs/apps/project-import.mdx

const TRAILING_SLASH = /\/$/;

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import {
  getBranches,
  getLanguages,
  getReadme,
  getRepo,
} from "@/src/features/projects/lib/github-client";

export async function POST(req: Request) {
  try {
    const { repoInput } = await req.json();

    if (!repoInput?.includes("/")) {
      return NextResponse.json(
        { error: "Use owner/repo format, like vercel/next.js" },
        { status: 400 }
      );
    }

    const cleaned = repoInput
      .trim()
      .replace("https://github.com/", "")
      .replace("http://github.com/", "")
      .replace(TRAILING_SLASH, "");

    const [githubOwner, githubRepo] = cleaned.split("/");

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

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to import GitHub repo." },
      { status: 500 }
    );
  }
}
