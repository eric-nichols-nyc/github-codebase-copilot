import { listUserRepos } from "@/src/features/projects/lib/github-client";

export async function GET() {
  try {
    const repos = await listUserRepos();
    return Response.json({ repos });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to list repositories";
    const missingToken = message.includes("GITHUB_TOKEN");
    return Response.json(
      { error: message },
      { status: missingToken ? 503 : 500 },
    );
  }
}
