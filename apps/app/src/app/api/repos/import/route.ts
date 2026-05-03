// apps/app/src/app/api/repos/import/route.ts
// Step-by-step import flow (GitHub → Neon): docs/content/docs/apps/project-import.mdx

import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { importProject } from "@/src/features/projects/lib/project-importer";
import { normalizeRepoTreeRootPrefix } from "@/src/features/projects/lib/repo-tree";
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

    const { githubOwner, githubRepo, repoTreeRoot } = parsed;

    let treeRootForSnapshot: string | null;
    if (repoTreeRoot !== undefined) {
      treeRootForSnapshot = normalizeRepoTreeRootPrefix(repoTreeRoot);
    } else {
      const [existing] = await db
        .select({ repoTreeRoot: projects.repoTreeRoot })
        .from(projects)
        .where(
          and(
            eq(projects.githubOwner, githubOwner),
            eq(projects.githubRepo, githubRepo)
          )
        )
        .limit(1);
      treeRootForSnapshot = normalizeRepoTreeRootPrefix(
        existing?.repoTreeRoot
      );
    }

    const payload = await importProject(githubOwner, githubRepo, {
      treeRootPrefix: treeRootForSnapshot,
    });
    const now = new Date();

    const treeRootColumn =
      repoTreeRoot !== undefined ? { repoTreeRoot } : undefined;

    const [project] = await db
      .insert(projects)
      .values({
        githubOwner: payload.githubOwner,
        githubRepo: payload.githubRepo,

        name: payload.name,
        description: payload.description,
        readme: payload.readme,
        repoUrl: payload.repoUrl,
        homepageUrl: payload.homepageUrl,
        languages: payload.languages,
        branches: payload.branches,
        repoTree: payload.repoTree,
        lastGithubUpdatedAt: payload.lastGithubUpdatedAt,
        lastSyncedAt: now,
        githubRaw: payload.githubRaw,

        createdAt: now,
        updatedAt: now,
        ...treeRootColumn,
      })
      .onConflictDoUpdate({
        target: [projects.githubOwner, projects.githubRepo],
        set: {
          name: payload.name,
          description: payload.description,
          readme: payload.readme,
          repoUrl: payload.repoUrl,
          homepageUrl: payload.homepageUrl,
          languages: payload.languages,
          branches: payload.branches,
          repoTree: payload.repoTree,
          lastGithubUpdatedAt: payload.lastGithubUpdatedAt,
          lastSyncedAt: now,
          githubRaw: payload.githubRaw,
          updatedAt: now,
          ...(treeRootColumn ?? {}),
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
