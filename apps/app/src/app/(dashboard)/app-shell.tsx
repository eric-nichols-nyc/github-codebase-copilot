"use client";

import { DashboardLayout } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AddRepoDialog } from "@/src/features/projects/components/add-repo-dialog";

import { AppSidebar } from "./sidebar";

type AppShellProps = {
  readonly children: ReactNode;
  /** Shown next to the sidebar trigger (e.g. "Admin" under `/admin`). */
  readonly headerLabel?: string;
};

export function AppShell({
  children,
  headerLabel = "Dashboard",
}: AppShellProps) {
  const pathname = usePathname();
  const showAddRepoDialog = pathname.includes("/admin");

  return (
    <DashboardLayout
      header={
        <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <span className="truncate text-muted-foreground text-sm">
              {headerLabel}
            </span>
          </div>
          <div className="flex shrink-0 justify-center">
            {showAddRepoDialog ? <AddRepoDialog /> : null}
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
