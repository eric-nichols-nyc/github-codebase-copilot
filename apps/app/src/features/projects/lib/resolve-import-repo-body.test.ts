import { describe, expect, it } from "vitest";

import { resolveImportRepoBody } from "./resolve-import-repo-body";

describe("resolveImportRepoBody", () => {
  it("accepts githubOwner and githubRepo", () => {
    expect(
      resolveImportRepoBody({ githubOwner: "acme", githubRepo: "demo" })
    ).toEqual({ githubOwner: "acme", githubRepo: "demo" });
  });

  it("trims owner and repo", () => {
    expect(
      resolveImportRepoBody({
        githubOwner: "  acme ",
        githubRepo: " demo ",
      })
    ).toEqual({ githubOwner: "acme", githubRepo: "demo" });
  });

  it("accepts repoInput URL and path forms", () => {
    expect(
      resolveImportRepoBody({ repoInput: "https://github.com/vercel/next.js/" })
    ).toEqual({ githubOwner: "vercel", githubRepo: "next.js" });
  });

  it("returns null when required fields are missing", () => {
    expect(resolveImportRepoBody({})).toBeNull();
    expect(resolveImportRepoBody({ githubOwner: "x" })).toBeNull();
    expect(resolveImportRepoBody({ repoInput: "nope" })).toBeNull();
  });
});
