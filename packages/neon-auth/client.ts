"use client";

import { createAuthClient } from "@neondatabase/auth/next";

export function createNeonAuthClient() {
  return createAuthClient();
}
