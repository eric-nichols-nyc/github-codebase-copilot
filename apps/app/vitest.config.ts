import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      include: ["__tests__/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
      setupFiles: ["./vitest.setup.ts"],
    },
  })
);
