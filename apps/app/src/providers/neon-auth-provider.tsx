"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type NeonAuthProviderProps = {
  readonly children: ReactNode;
};

export function NeonAuthProvider({ children }: NeonAuthProviderProps) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      Link={Link}
      navigate={router.push}
      onSessionChange={() => {
        router.refresh();
      }}
      organization={{}}
      redirectTo="/admin/repos"
      replace={router.replace}
      social={{
        providers: ["github"],
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
