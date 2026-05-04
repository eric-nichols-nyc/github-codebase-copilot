import "./styles.css";
import { Toaster } from "@repo/design-system/components/ui/sonner";
import { fonts } from "@repo/design-system/lib/fonts";
import { ThemeProvider } from "@repo/design-system/providers/theme";
import { NeonAuthProvider } from "@/src/providers/neon-auth-provider";
import { QueryProvider } from "@/src/providers/query-provider";
import type { ReactNode } from "react";

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <NeonAuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </NeonAuthProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
