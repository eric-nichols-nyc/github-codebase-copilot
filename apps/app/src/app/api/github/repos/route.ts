import { NextResponse } from "next/server";
import { getProjects } from "@/src/features/projects/lib/project-service";

export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
