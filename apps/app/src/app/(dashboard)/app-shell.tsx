"use client";

import { DashboardLayout } from "@repo/design-system/components/layout";
import { SidebarTrigger } from "@repo/design-system/components/ui/sidebar";
import type { ReactNode } from "react";

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
        </>
      }
      sidebar={<AppSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}
