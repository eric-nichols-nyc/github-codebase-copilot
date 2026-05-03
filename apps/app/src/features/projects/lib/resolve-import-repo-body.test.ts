import { describe, expect, it } from "vitest";

import { resolveImportRepoBody } from "./resolve-import-repo-body";

describe("resolveImportRepoBody", () => {
  it("accepts githubOwner and githubRepo", () => {
    expect(
      resolveImportRepoBody({ githubOwner: "acme", githubRepo: "demo" })
    ).toEqual({
      githubOwner: "acme",
      githubRepo: "demo",
      repoTreeRoot: undefined,
    });
  });

  it("trims owner and repo", () => {
    expect(
      resolveImportRepoBody({
        githubOwner: "  acme ",
        githubRepo: " demo ",
      })
    ).toEqual({
      githubOwner: "acme",
      githubRepo: "demo",
      repoTreeRoot: undefined,
    });
  });

  it("accepts repoInput URL and path forms", () => {
    expect(
      resolveImportRepoBody({ repoInput: "https://github.com/vercel/next.js/" })
    ).toEqual({
      githubOwner: "vercel",
      githubRepo: "next.js",
      repoTreeRoot: undefined,
    });
  });

  it("normalizes repoTreeRoot when provided", () => {
    expect(
      resolveImportRepoBody({
        githubOwner: "o",
        githubRepo: "r",
        repoTreeRoot: " /apps/app/ ",
      })
    ).toEqual({
      githubOwner: "o",
      githubRepo: "r",
      repoTreeRoot: "apps/app",
    });
  });

  it("treats explicit null repoTreeRoot as clear", () => {
    expect(
      resolveImportRepoBody({
        githubOwner: "o",
        githubRepo: "r",
        repoTreeRoot: null,
      })
    ).toEqual({
      githubOwner: "o",
      githubRepo: "r",
      repoTreeRoot: null,
    });
  });

  it("returns null when required fields are missing", () => {
    expect(resolveImportRepoBody({})).toBeNull();
    expect(resolveImportRepoBody({ githubOwner: "x" })).toBeNull();
    expect(resolveImportRepoBody({ repoInput: "nope" })).toBeNull();
  });
});
