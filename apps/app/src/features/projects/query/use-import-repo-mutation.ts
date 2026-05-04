"use client";

import { useMutation } from "@tanstack/react-query";

export type ImportRepoInput = {
  githubOwner: string;
  githubRepo: string;
  /** Monorepo subfolder for the Files tab (e.g. `apps/app`). Omit to leave unchanged on re-import. */
  repoTreeRoot?: string | null;
};

type ImportRepoJson =
  | { ok: true; project: { id: string; slug: string } }
  | { error: string };

export type ImportRepoSuccess = {
  ok: true;
  project: { id: string; slug: string };
};

async function importRepo(input: ImportRepoInput): Promise<ImportRepoSuccess> {
  const res = await fetch("/api/repos/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as ImportRepoJson;
  if (!res.ok) {
    const message =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Import failed";
    throw new Error(message);
  }
  if (!("ok" in data) || data.ok !== true || !("project" in data)) {
    throw new Error("Import failed");
  }
  return data;
}

export function useImportRepoMutation() {
  return useMutation({
    mutationFn: importRepo,
    mutationKey: ["projects", "import-repo"],
  });
}
