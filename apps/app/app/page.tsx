import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Sparkles } from "lucide-react";

const HomePage = () => (
  <main className="flex min-h-screen items-center justify-center bg-background p-8">
    <Card className="relative w-full max-w-md">
      <CardHeader className="text-center">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">App</CardTitle>
        <CardDescription>
          Next.js app wired to the shared design system
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-center text-muted-foreground text-sm">
          Theme, typography, and components come from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            @repo/design-system
          </code>
          .
        </p>
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  </main>
);

export default HomePage;
