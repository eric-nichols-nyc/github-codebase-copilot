import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  return NextResponse.json({ projectId, stub: true });
}

export async function PATCH(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  return NextResponse.json({ projectId, stub: true });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  return NextResponse.json({ projectId, stub: true });
}
