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
        <>
          <SidebarTrigger />
          <span className="truncate text-muted-foreground text-sm">
            Dashboard
          </span>
          <div className="ml-auto flex shrink-0 items-center">
            <AddRepoDialog />
          </div>
        </>
      }
      sidebar={<AppSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}
