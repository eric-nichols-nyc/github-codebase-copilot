import type {
  ProjectBranchesJson,
  ProjectGithubRawJson,
} from "@/lib/db/schema";

export type BranchRow = {
  readonly name: string;
  readonly sha: string;
};

export const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  CSS: "bg-purple-500",
  HTML: "bg-orange-500",
  Shell: "bg-green-500",
  Handlebars: "bg-amber-600",
};

export function githubNumber(
  raw: ProjectGithubRawJson | null,
  key: string
): number {
  const v = raw?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function githubString(
  raw: ProjectGithubRawJson | null,
  key: string
): string {
  const v = raw?.[key];
  return typeof v === "string" ? v : "";
}

function branchShaFromRecord(o: Record<string, unknown>): string {
  if (typeof o.sha === "string") {
    return o.sha;
  }
  const commit = o.commit;
  if (typeof commit !== "object" || commit === null) {
    return "";
  }
  const sha = (commit as Record<string, unknown>).sha;
  return typeof sha === "string" ? sha : "";
}

function parseBranchItem(item: unknown, index: number): BranchRow | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }
  const o = item as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name : "";
  const sha = branchShaFromRecord(o);
  if (name === "" && sha === "") {
    return null;
  }
  return { name, sha: sha !== "" ? sha : `row-${index}` };
}

export function normalizeBranches(
  raw: ProjectBranchesJson | null
): BranchRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: BranchRow[] = [];
  for (let i = 0; i < raw.length; i++) {
    const row = parseBranchItem(raw[i], i);
    if (row !== null) {
      out.push(row);
    }
  }
  return out;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (value === undefined || value === null) {
    return "—";
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(
  value: Date | string | null | undefined
): string {
  if (value === undefined || value === null) {
    return "—";
  }
  const date = value instanceof Date ? value : new Date(value);
  const t = date.getTime();
  if (Number.isNaN(t)) {
    return "—";
  }
  const now = Date.now();
  const diffMs = now - t;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return formatDate(value);
}
