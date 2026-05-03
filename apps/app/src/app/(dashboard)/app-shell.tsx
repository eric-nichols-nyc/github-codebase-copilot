"use client";

import { DashboardLayout } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { ReactNode } from "react";
import { AddRepoDialog } from "@/src/features/projects/components/add-repo-dialog";

import { AppSidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      header={
        <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <span className="truncate text-muted-foreground text-sm">
              Dashboard
            </span>
          </div>
          <div className="flex shrink-0 justify-center">
            <AddRepoDialog />
          </div>
          <div className="min-w-0" />
        </div>
      }
      sidebar={<AppSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}
