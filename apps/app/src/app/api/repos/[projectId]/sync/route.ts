import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  return NextResponse.json({ projectId, stub: true });
}
