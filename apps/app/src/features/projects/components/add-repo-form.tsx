"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { toast } from "@repo/design-system/components/ui/sonner";
import { Spinner } from "@repo/design-system/components/ui/spinner";
import { useImportRepoMutation } from "@/src/features/projects/query/use-import-repo-mutation";
import { useCallback, useEffect, useState } from "react";

type RepoOption = { fullName: string; name: string; private: boolean };

function parseFullName(
  fullName: string
): { githubOwner: string; githubRepo: string } | null {
  const i = fullName.indexOf("/");
  if (i <= 0 || i === fullName.length - 1) {
    return null;
  }
  return {
    githubOwner: fullName.slice(0, i),
    githubRepo: fullName.slice(i + 1),
  };
}

async function loadGithubRepos(): Promise<
  { ok: true; repos: RepoOption[] } | { ok: false; error: string }
> {
  try {
    const res = await fetch("/api/repos/github");
    const data = (await res.json()) as {
      repos?: RepoOption[];
      error?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? "Could not load repositories",
      };
    }
    return { ok: true, repos: data.repos ?? [] };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not load repositories",
    };
  }
}

export type AddRepoFormProps = {
  /** Called after a project is saved successfully (e.g. to close a dialog). */
  onImportSuccess?: () => void;
};

export function AddRepoForm({ onImportSuccess }: AddRepoFormProps = {}) {
  const [repos, setRepos] = useState<RepoOption[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const { mutate: importRepo, isPending: importPending } =
    useImportRepoMutation();

  useEffect(() => {
    let cancelled = false;
    setReposLoading(true);
    loadGithubRepos().then((result) => {
      if (cancelled) {
        return;
      }
      if (result.ok) {
        setRepos(result.repos);
      } else {
        toast.error("Could not load repositories", {
          description: result.error,
        });
      }
      setReposLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onImport = useCallback(() => {
    const fullName = selected ?? "";
    const parsed = parseFullName(fullName);
    if (!parsed) {
      toast.error("Select a repository", {
        description: "Choose a repo from the list before importing.",
      });
      return;
    }
    importRepo(parsed, {
      onSuccess: () => {
        toast.success("Project imported", {
          description: `${parsed.githubOwner}/${parsed.githubRepo}`,
        });
        onImportSuccess?.();
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Import failed";
        toast.error("Import failed", { description: message });
      },
    });
  }, [importRepo, onImportSuccess, selected]);

  const noReposMessage =
    repos.length === 0 && !reposLoading ? "No repositories found." : null;

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="repo-import-select">GitHub repository</FieldLabel>
        <FieldContent>
          <div className="flex flex-wrap items-center gap-2">
            {reposLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Spinner />
                Loading repositories…
              </div>
            ) : (
              <Select onValueChange={setSelected} value={selected}>
                <SelectTrigger
                  className="w-full min-w-0 max-w-md"
                  disabled={repos.length === 0}
                  id="repo-import-select"
                >
                  <SelectValue placeholder="Choose a repository" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((r) => (
                    <SelectItem key={r.fullName} value={r.fullName}>
                      {r.fullName}
                      {r.private === true ? " (private)" : null}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              disabled={
                selected === undefined || importPending || reposLoading
              }
              onClick={() => {
                onImport();
              }}
              type="button"
            >
              {importPending ? (
                <>
                  <Spinner />
                  Importing…
                </>
              ) : (
                "Import"
              )}
            </Button>
          </div>
          <FieldDescription>
            Repositories are listed from your configured GitHub token (first
            100, recently updated).
          </FieldDescription>
          <FieldError>{noReposMessage}</FieldError>
        </FieldContent>
      </Field>
    </div>
  );
}
