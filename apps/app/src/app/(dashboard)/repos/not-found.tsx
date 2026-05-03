import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function ReposNotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4 p-8">
      <div className="max-w-md text-center">
        <p className="font-medium text-lg">Repository not found</p>
        <p className="mt-2 text-muted-foreground text-sm">
          This project may have been removed or the link is incorrect.
        </p>
      </div>
      <Button asChild>
        <Link href="/repos">Back to repositories</Link>
      </Button>
    </div>
  );
}
