import { describe, expect, it } from "vitest";

import { normalizeRepoTreeRootPrefix, simplifyTree } from "./repo-tree";

describe("normalizeRepoTreeRootPrefix", () => {
  it("trims slashes and whitespace", () => {
    expect(normalizeRepoTreeRootPrefix(" /apps/app/ ")).toBe("apps/app");
  });

  it("returns null for empty input", () => {
    expect(normalizeRepoTreeRootPrefix(null)).toBeNull();
    expect(normalizeRepoTreeRootPrefix(undefined)).toBeNull();
    expect(normalizeRepoTreeRootPrefix("  ")).toBeNull();
  });
});

describe("simplifyTree", () => {
  it("applies root prefix before the 500 cap", () => {
    const tree = [
      { path: "docs/readme.md", type: "blob" },
      { path: "apps/app/package.json", type: "blob" },
      { path: "apps/app/src/index.ts", type: "blob" },
    ];
    const out = simplifyTree(tree, { rootPrefix: "apps/app" });
    expect(out?.map((e) => e.path).sort()).toEqual(
      ["apps/app/package.json", "apps/app/src/index.ts"].sort()
    );
  });

  it("keeps whole repo when root is null", () => {
    const tree = [
      { path: "docs/readme.md", type: "blob" },
      { path: "apps/app/x.ts", type: "blob" },
    ];
    const out = simplifyTree(tree, { rootPrefix: null });
    expect(out?.map((e) => e.path).sort()).toEqual(
      ["apps/app/x.ts", "docs/readme.md"].sort()
    );
  });
});
