"use client";

import type { NeonAuthAdapter } from "@neondatabase/auth";
import { createAuthClient } from "@neondatabase/auth/next";
import type { NeonAuthUIProviderProps } from "@neondatabase/auth/react/ui";

export const authClient: NeonAuthUIProviderProps<NeonAuthAdapter>["authClient"] =
  createAuthClient();
