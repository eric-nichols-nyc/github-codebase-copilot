"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import { ImportIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { AddRepoForm } from "./add-repo-form";

export function AddRepoDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setFormKey((k) => k + 1);
    }
  }, []);

  const handleSuccess = useCallback(() => {
    window.setTimeout(() => {
      setOpen(false);
    }, 600);
  }, []);

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="outline">
          <ImportIcon />
          Import repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import repository</DialogTitle>
          <DialogDescription>
            Choose a GitHub repository to add to your projects.
          </DialogDescription>
        </DialogHeader>
        <AddRepoForm key={formKey} onImportSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
