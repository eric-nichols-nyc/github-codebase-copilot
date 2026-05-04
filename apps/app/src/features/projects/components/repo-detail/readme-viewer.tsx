"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProjectSelectRow } from "@/lib/db/schema";

type RepoReadmeViewerProps = {
  readonly project: ProjectSelectRow;
};

/** Turn README `![](./docs/x.png)` into a raw.githubusercontent.com URL. */
function resolveReadmeImageUrl(
  src: string | undefined,
  project: ProjectSelectRow,
): string | undefined {
  if (src === undefined || src.trim() === "") {
    return;
  }
  const s = src.trim();
  if (s.startsWith("data:")) {
    return s;
  }
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return s;
  }
  if (s.startsWith("//")) {
    return `https:${s}`;
  }

  const raw = project.githubRaw as { default_branch?: unknown } | null;
  const branch =
    typeof raw?.default_branch === "string" && raw.default_branch.trim() !== ""
      ? raw.default_branch.trim()
      : "main";
  const base = `https://raw.githubusercontent.com/${project.githubOwner}/${project.githubRepo}/${branch}/`;
  try {
    return new URL(s, base).href;
  } catch {
    return;
  }
}

function markdownComponentsFor(project: ProjectSelectRow): Components {
  return {
    a: ({ href, children, ...props }) => {
      const external =
        typeof href === "string" &&
        (href.startsWith("http://") || href.startsWith("https://"));
      return (
        <a
          href={href}
          {...props}
          {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        >
          {children}
        </a>
      );
    },
    img: ({ node: _node, src, alt, title, ...props }) => {
      const resolved = resolveReadmeImageUrl(
        typeof src === "string" ? src : undefined,
        project,
      );
      if (!resolved) {
        return (
          <span className="text-muted-foreground text-xs italic">
            Invalid image URL
          </span>
        );
      }
      return (
        <img
          {...props}
          alt={alt ?? ""}
          className="my-2 max-h-[50vh] max-w-full rounded-md border object-contain"
          decoding="async"
          loading="lazy"
          referrerPolicy="no-referrer"
          src={resolved}
          title={title ?? undefined}
        />
      );
    },
  };
}

export function RepoReadmeViewer({ project }: RepoReadmeViewerProps) {
  if (!project.readme) {
    return (
      <p className="text-muted-foreground text-sm">
        No README was fetched for this repository yet. Re-import after adding a
        README on GitHub, or if the API could not decode it.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className="font-medium text-sm">README.md</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div
          className="prose prose-sm dark:prose-invert max-h-[min(32rem,calc(100dvh-16rem))] max-w-none prose-headings:scroll-mt-4 overflow-auto prose-pre:overflow-x-auto rounded-md border bg-muted/20 p-4 prose-pre:text-xs prose-table:text-sm"
          data-slot="readme-markdown"
        >
          <ReactMarkdown
            components={markdownComponentsFor(project)}
            remarkPlugins={[remarkGfm]}
          >
            {project.readme}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
