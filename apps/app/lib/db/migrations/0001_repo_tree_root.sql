ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "repo_tree" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "repo_tree_root" text;
