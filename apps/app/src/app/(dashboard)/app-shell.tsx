"use client";

/**
 * Shared chrome for dashboard + admin. Sidebar variant:
 * - URL includes `/admin` → {@link AdminAppSidebar}
 * - otherwise → {@link PublicAppSidebar}
 */
import { DashboardLayout } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AddRepoDialog } from "@/src/features/projects/components/add-repo-dialog";

import { AdminAppSidebar } from "./admin-app-sidebar";
import { PublicAppSidebar } from "./public-app-sidebar";

type AppShellProps = {
  readonly children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes("/admin");
  const showAddRepoDialog = isAdminRoute;
  const headerLabel = isAdminRoute ? "Admin" : "Dashboard";

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
      sidebar={isAdminRoute ? <AdminAppSidebar /> : <PublicAppSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}
