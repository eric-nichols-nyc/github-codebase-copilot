import { describe, expect, it } from "vitest";

import { firstRepoDetailHref } from "./repo-routing";

describe("firstRepoDetailHref", () => {
  it("returns null for an empty list", () => {
    expect(firstRepoDetailHref([])).toBeNull();
  });

  it("returns /repos/{id} for the first project", () => {
    expect(
      firstRepoDetailHref([{ id: "a" }, { id: "b" }])
    ).toBe("/repos/a");
  });

  it("returns /admin/repos/{id} when base is admin", () => {
    expect(firstRepoDetailHref([{ id: "x" }], "/admin/repos")).toBe(
      "/admin/repos/x"
    );
  });
});
