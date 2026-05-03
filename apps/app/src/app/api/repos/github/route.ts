import { NextResponse } from "next/server";
import { listGitHubUserRepos } from "@/src/features/projects/lib/github-client";

export async function GET() {
  try {
    const repos = await listGitHubUserRepos();
    return NextResponse.json({ repos });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch repositories",
      },
      { status: 500 }
    );
  }
}
