ALTER TABLE "places" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "google_types" text[];--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "area" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "last_synced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;