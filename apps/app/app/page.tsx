import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Database } from "lucide-react";

const HomePage = () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">App</CardTitle>
        <CardDescription>
          Drizzle ORM and Neon serverless, with the shared design system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground text-sm">
          Set <code className="font-mono text-xs">DATABASE_URL</code> in{" "}
          <code className="font-mono text-xs">.env.local</code>, then run{" "}
          <code className="font-mono text-xs">pnpm db:push</code> from this app.
          Use <code className="font-mono text-xs">getDb()</code> from{" "}
          <code className="font-mono text-xs">@/lib/db</code> on the server.
        </p>
        <div className="flex justify-center">
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  </main>
);

export default HomePage;
