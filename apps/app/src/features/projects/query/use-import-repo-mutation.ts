"use client";

import { useMutation } from "@tanstack/react-query";

export type ImportRepoInput = {
  githubOwner: string;
  githubRepo: string;
};

type ImportRepoResponse =
  | { ok: true; count: number; projects: { id: string }[] }
  | { error: string };

async function importRepo(input: ImportRepoInput): Promise<ImportRepoResponse> {
  const res = await fetch("/api/projects/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as ImportRepoResponse;
  if (!res.ok) {
    const message =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Import failed";
    throw new Error(message);
  }
  if (!("ok" in data) || data.ok !== true) {
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
