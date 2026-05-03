import { db } from "@/lib/db";
import {
  type ProjectLanguagesJson,
  projects,
} from "@/lib/db/schema";
import type { InferInsertModel } from "drizzle-orm";

type ProjectInsert = InferInsertModel<typeof projects>;

function requireNonEmptyString(
  value: unknown,
  field: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function strOrNull(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("Expected string or null for text field");
  }
  return value;
}

function languagesOrNull(value: unknown): ProjectLanguagesJson | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("languages must be a JSON object of string → number");
  }
  for (const n of Object.values(value)) {
    if (typeof n !== "number") {
      throw new Error("languages values must be numbers (byte counts)");
    }
  }
  return value as ProjectLanguagesJson;
}

function jsonOrNull(value: unknown): unknown | null {
  if (value === undefined || value === null) {
    return null;
  }
  return value;
}

function stringArrayOrNull(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (!Array.isArray(value)) {
    throw new Error("Expected array of strings or null");
  }
  for (const x of value) {
    if (typeof x !== "string") {
      throw new Error("Expected array of strings or null");
    }
  }
  return value;
}

function dateOrNull(value: unknown): Date | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("lastGithubUpdatedAt must be an ISO date string or null");
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error("lastGithubUpdatedAt is not a valid date");
  }
  return d;
}

function boolOrDefault(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value !== "boolean") {
    throw new Error("featured must be a boolean");
  }
  return value;
}

function parseProject(raw: unknown): ProjectInsert {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("Each project must be a JSON object");
  }
  const o = raw as Record<string, unknown>;

  return {
    githubOwner: requireNonEmptyString(o.githubOwner, "githubOwner"),
    githubRepo: requireNonEmptyString(o.githubRepo, "githubRepo"),
    name: strOrNull(o.name),
    description: strOrNull(o.description),
    readme: strOrNull(o.readme),
    repoUrl: strOrNull(o.repoUrl),
    languages: languagesOrNull(o.languages),
    branches: jsonOrNull(o.branches),
    lastGithubUpdatedAt: dateOrNull(o.lastGithubUpdatedAt),
    displayTitle: strOrNull(o.displayTitle),
    customSummary: strOrNull(o.customSummary),
    imageUrl: strOrNull(o.imageUrl),
    techStack: stringArrayOrNull(o.techStack),
    apisUsed: stringArrayOrNull(o.apisUsed),
    architectureNotes: strOrNull(o.architectureNotes),
    challenges: strOrNull(o.challenges),
    lessonsLearned: strOrNull(o.lessonsLearned),
    portfolioBlurb: strOrNull(o.portfolioBlurb),
    interviewTalkingPoints: strOrNull(o.interviewTalkingPoints),
    tags: stringArrayOrNull(o.tags),
    featured: boolOrDefault(o.featured, false),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(body) ? body : [body];
  if (items.length === 0) {
    return Response.json(
      { error: "Provide a project object or a non-empty array" },
      { status: 400 },
    );
  }

  const saved: (typeof projects.$inferSelect)[] = [];

  try {
    for (const raw of items) {
      const row = parseProject(raw);
      const { githubOwner, githubRepo, ...rest } = row;

      const [out] = await db
        .insert(projects)
        .values({ githubOwner, githubRepo, ...rest })
        .onConflictDoUpdate({
          target: [projects.githubOwner, projects.githubRepo],
          set: rest,
        })
        .returning();

      if (out) {
        saved.push(out);
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed";
    const status = message.includes("must be") ? 400 : 500;
    return Response.json({ error: message }, { status });
  }

  return Response.json({
    ok: true,
    count: saved.length,
    projects: saved,
  });
}
