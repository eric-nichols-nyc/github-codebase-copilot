import {
  boolean,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** GitHub language stats (bytes per language) or similar payload from the API */
export type ProjectLanguagesJson = Record<string, number>;

/** Branch list payload from GitHub (names, protection, default, etc.) */
export type ProjectBranchesJson = unknown;

/** Snapshot of GitHub repo fields returned by our importer (stored for debugging / re-sync). */
export type ProjectGithubRawJson = Record<string, unknown>;

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    githubOwner: text("github_owner").notNull(),
    githubRepo: text("github_repo").notNull(),

    name: text("name"),
    description: text("description"),
    readme: text("readme"),
    repoUrl: text("repo_url"),
    homepageUrl: text("homepage_url"),
    languages: jsonb("languages").$type<ProjectLanguagesJson | null>(),
    branches: jsonb("branches").$type<ProjectBranchesJson | null>(),
    lastGithubUpdatedAt: timestamp("last_github_updated_at", {
      withTimezone: true,
    }),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    githubRaw: jsonb("github_raw").$type<ProjectGithubRawJson | null>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    displayTitle: text("display_title"),
    customSummary: text("custom_summary"),
    imageUrl: text("image_url"),
    techStack: jsonb("tech_stack").$type<string[] | null>(),
    apisUsed: jsonb("apis_used").$type<string[] | null>(),
    architectureNotes: text("architecture_notes"),
    challenges: text("challenges"),
    lessonsLearned: text("lessons_learned"),
    portfolioBlurb: text("portfolio_blurb"),
    interviewTalkingPoints: text("interview_talking_points"),
    tags: jsonb("tags").$type<string[] | null>(),
    featured: boolean("featured").default(false).notNull(),
  },
  (table) => [
    uniqueIndex("projects_github_owner_repo_unique").on(
      table.githubOwner,
      table.githubRepo
    ),
  ]
);
