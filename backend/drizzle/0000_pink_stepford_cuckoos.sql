CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE "public"."place_source" AS ENUM('google', 'user', 'admin');--> statement-breakpoint
CREATE TABLE "place_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"url" text NOT NULL,
	"type" text,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_tags" (
	"place_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "place_tags_place_id_tag_id_pk" PRIMARY KEY("place_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"geom" "geography(Point, 4326)",
	"category" text NOT NULL,
	"source" "place_source" NOT NULL,
	"external_id" text,
	"opening_hours" text,
	"contact_phone" text,
	"website_url" text,
	"price_level" integer,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	"rating" double precision NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_places" (
	"user_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_places_user_id_place_id_pk" PRIMARY KEY("user_id","place_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "place_media" ADD CONSTRAINT "place_media_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_media" ADD CONSTRAINT "place_media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_tags" ADD CONSTRAINT "place_tags_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_tags" ADD CONSTRAINT "place_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_places_category" ON "places" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_places_source" ON "places" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_places_created_by" ON "places" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_places_external_unique" ON "places" USING btree ("external_id") WHERE "places"."external_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_reviews_place" ON "reviews" USING btree ("place_id");--> statement-breakpoint
CREATE INDEX "idx_saved_user" ON "saved_places" USING btree ("user_id");