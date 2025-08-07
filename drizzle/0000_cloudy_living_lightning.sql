CREATE TABLE `coupons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`redeemed` integer DEFAULT false NOT NULL,
	`code` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_email_unique` ON `coupons` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_phone_unique` ON `coupons` (`phone`);