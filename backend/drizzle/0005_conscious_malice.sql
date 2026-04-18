ALTER TABLE "places" ADD COLUMN "custom_description" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "vibe" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "is_hidden_gem" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "priority_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "best_time_to_visit" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "avg_cost_for_two" integer;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "crowd_level_override" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "notes" text;