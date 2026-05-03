import type { ReactNode } from "react";

type RepoDetailShellProps = {
  readonly children: ReactNode;
};

export function RepoDetailShell({ children }: RepoDetailShellProps) {
  return <div className="flex min-h-0 flex-1 flex-col gap-4">{children}</div>;
}
