import { describe, expect, it } from "vitest";

import { mapGitHubUserReposResponse } from "./github-client";

describe("mapGitHubUserReposResponse", () => {
  it("maps valid GitHub repo rows", () => {
    expect(
      mapGitHubUserReposResponse([
        {
          full_name: "acme/widget",
          name: "widget",
          private: false,
        },
        {
          full_name: "acme/secret",
          name: "secret",
          private: true,
        },
      ])
    ).toEqual([
      { fullName: "acme/widget", name: "widget", private: false },
      { fullName: "acme/secret", name: "secret", private: true },
    ]);
  });

  it("returns an empty array for an empty GitHub array", () => {
    expect(mapGitHubUserReposResponse([])).toEqual([]);
  });

  it("skips malformed rows but keeps valid ones", () => {
    expect(
      mapGitHubUserReposResponse([
        { not: "a repo" },
        { full_name: "ok/repo", name: "repo", private: false },
      ])
    ).toEqual([{ fullName: "ok/repo", name: "repo", private: false }]);
  });

  it("throws when the body is not an array", () => {
    expect(() =>
      mapGitHubUserReposResponse({
        message: "API rate limit exceeded",
      })
    ).toThrow(/API rate limit exceeded/);
  });

  it("throws when every row is unrecognized but the array is non-empty", () => {
    expect(() =>
      mapGitHubUserReposResponse([{ id: 1 }, { foo: "bar" }])
    ).toThrow(/none matched the expected shape/);
  });
});
