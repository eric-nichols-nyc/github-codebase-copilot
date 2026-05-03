CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_owner" text NOT NULL,
	"github_repo" text NOT NULL,
	"name" text,
	"description" text,
	"readme" text,
	"repo_url" text,
	"homepage_url" text,
	"languages" jsonb,
	"branches" jsonb,
	"last_github_updated_at" timestamp with time zone,
	"last_synced_at" timestamp with time zone,
	"github_raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"display_title" text,
	"custom_summary" text,
	"image_url" text,
	"tech_stack" jsonb,
	"apis_used" jsonb,
	"architecture_notes" text,
	"challenges" text,
	"lessons_learned" text,
	"portfolio_blurb" text,
	"interview_talking_points" text,
	"tags" jsonb,
	"featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "projects_github_owner_repo_unique" ON "projects" USING btree ("github_owner","github_repo");