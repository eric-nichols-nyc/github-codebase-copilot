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

const markdownComponents: Components = {
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
};

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
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {project.readme}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
