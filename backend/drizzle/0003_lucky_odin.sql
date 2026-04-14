ALTER TABLE "places" ADD COLUMN "average_rating" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;