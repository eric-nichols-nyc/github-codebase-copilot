import { auth } from "@/lib/auth/server";
import { AppShell } from "@/src/app/(dashboard)/app-shell";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return <AppShell headerLabel="Admin">{children}</AppShell>;
}
