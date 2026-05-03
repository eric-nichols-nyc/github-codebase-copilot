import type { ReactNode } from "react";

import { AppShell } from "../(dashboard)/app-shell";

export default function DashboardSectionLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
