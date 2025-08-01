CREATE SCHEMA "holiday_coupon";
--> statement-breakpoint
CREATE TABLE "holiday_coupon"."coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code"),
	CONSTRAINT "coupons_email_unique" UNIQUE("email"),
	CONSTRAINT "coupons_phone_unique" UNIQUE("phone")
);
