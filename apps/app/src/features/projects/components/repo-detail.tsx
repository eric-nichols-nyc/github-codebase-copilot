"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import type { ProjectSelectRow } from "@/lib/db/schema";
import { RepoArchitectureNotes } from "./repo-detail/architecture-notes";
import { RepoDetailFiles } from "./repo-detail/files";
import { RepoDetailHeader } from "./repo-detail/header";
import { RepoInterviewTalkingPoints } from "./repo-detail/interview-talking-points";
import { RepoDetailMetadata } from "./repo-detail/metadata";
import { RepoDetailOverview } from "./repo-detail/overview";
import { RepoReadmeViewer } from "./repo-detail/readme-viewer";
import { RepoDetailShell } from "./repo-detail/shell";

type RepoDetailProps = {
  readonly project: ProjectSelectRow;
  /** Mirrors the page: `/admin/repos` shows admin-only overview sections. */
  readonly reposBasePath: "/repos" | "/admin/repos";
};

const repoDetailTabTriggerClassName =
  "min-w-[5.5rem] flex-1 rounded-none border-0 bg-transparent px-2 py-2 text-center font-medium text-muted-foreground text-xs shadow-none transition-colors hover:bg-muted/70 hover:text-foreground sm:min-w-0 sm:px-3 sm:text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none dark:data-[state=active]:bg-accent dark:data-[state=active]:text-accent-foreground";

export function RepoDetail({ project, reposBasePath }: RepoDetailProps) {
  return (
    <RepoDetailShell>
      <RepoDetailHeader project={project} />
      <Tabs
        className="flex min-h-0 flex-1 flex-col gap-3"
        defaultValue="overview"
      >
        <div className="w-full shrink-0 overflow-x-auto pb-1">
          <TabsList className="flex h-10 min-w-full gap-0 divide-x divide-border rounded-lg border border-border bg-muted/50 p-0 shadow-none sm:h-11">
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="readme"
            >
              README
            </TabsTrigger>
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="files"
            >
              Files
            </TabsTrigger>
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="architecture"
            >
              Architecture
            </TabsTrigger>
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="interview"
            >
              Interview
            </TabsTrigger>
            <TabsTrigger
              className={repoDetailTabTriggerClassName}
              value="metadata"
            >
              Metadata
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="overview"
        >
          <RepoDetailOverview project={project} reposBasePath={reposBasePath} />
        </TabsContent>
        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="readme"
        >
          <RepoReadmeViewer project={project} />
        </TabsContent>
        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="files"
        >
          <RepoDetailFiles project={project} />
        </TabsContent>
        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="architecture"
        >
          <RepoArchitectureNotes project={project} />
        </TabsContent>
        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="interview"
        >
          <RepoInterviewTalkingPoints project={project} />
        </TabsContent>
        <TabsContent
          className="min-h-0 flex-1 overflow-y-auto focus-visible:outline-none"
          value="metadata"
        >
          <RepoDetailMetadata project={project} />
        </TabsContent>
      </Tabs>
    </RepoDetailShell>
  );
}
