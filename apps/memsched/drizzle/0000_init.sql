CREATE TABLE `auth_provider` (
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	PRIMARY KEY(`provider_id`, `provider_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `github_stats_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`stat_type` text DEFAULT 'commits' NOT NULL,
	`time_range` text NOT NULL,
	`value` real NOT NULL,
	`last_updated` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `objective` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`start_value` real NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`goal_type` text NOT NULL,
	`end_value` real,
	`archived` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `objective_log` (
	`id` text PRIMARY KEY NOT NULL,
	`value` real NOT NULL,
	`notes` text,
	`logged_at` integer NOT NULL,
	`objective_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `logged_at_index` ON `objective_log` (`logged_at`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`admin` integer DEFAULT false NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`bio` text,
	`location` text,
	`website` text,
	`stripe_customer_id` text,
	`subscription_status` text DEFAULT 'inactive',
	`stripe_plan_id` text,
	`subscription_period_end` integer,
	`cancel_at_period_end` integer DEFAULT false,
	`deleted_at` integer,
	`anonymized` integer DEFAULT false,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `user_deletion_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`reason` text NOT NULL,
	`deleted_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `widget` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text NOT NULL,
	`image_url` text,
	`image_placement` text NOT NULL,
	`text_icon` text,
	`visibility` text DEFAULT 'public' NOT NULL,
	`padding` integer NOT NULL,
	`border` integer NOT NULL,
	`border_width` integer NOT NULL,
	`border_radius` integer NOT NULL,
	`color` text NOT NULL,
	`accent_color` text NOT NULL,
	`background_color` text NOT NULL,
	`watermark` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`provider` text DEFAULT 'objective' NOT NULL,
	`objective_id` text,
	`github_username` text,
	`github_stat_type` text,
	`style` text DEFAULT 'metric-base' NOT NULL,
	`period` text NOT NULL,
	`name` text,
	`value_display_precision` integer,
	`value_percent` integer,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
