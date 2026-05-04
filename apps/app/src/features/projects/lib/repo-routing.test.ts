import { describe, expect, it } from "vitest";

import { firstRepoDetailHref } from "./repo-routing";

describe("firstRepoDetailHref", () => {
  it("returns null for an empty list", () => {
    expect(firstRepoDetailHref([])).toBeNull();
  });

  it("returns /repos/{slug} for the first project", () => {
    expect(
      firstRepoDetailHref([{ slug: "a" }, { slug: "b" }])
    ).toBe("/repos/a");
  });

  it("returns /admin/repos/{slug} when base is admin", () => {
    expect(firstRepoDetailHref([{ slug: "x" }], "/admin/repos")).toBe(
      "/admin/repos/x"
    );
  });
});
