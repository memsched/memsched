PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auth_provider` (
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	PRIMARY KEY(`provider_id`, `provider_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_auth_provider`("provider_id", "provider_user_id", "user_id", "created_at") SELECT "provider_id", "provider_user_id", "user_id", "created_at" FROM `auth_provider`;--> statement-breakpoint
DROP TABLE `auth_provider`;--> statement-breakpoint
ALTER TABLE `__new_auth_provider` RENAME TO `auth_provider`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_objective` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`start_value` real NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`visibility` text NOT NULL,
	`goal_type` text NOT NULL,
	`end_value` real,
	`archived` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_objective`("id", "name", "description", "start_value", "value", "unit", "visibility", "goal_type", "end_value", "archived", "user_id", "created_at") SELECT "id", "name", "description", "start_value", "value", "unit", "visibility", "goal_type", "end_value", "archived", "user_id", "created_at" FROM `objective`;--> statement-breakpoint
DROP TABLE `objective`;--> statement-breakpoint
ALTER TABLE `__new_objective` RENAME TO `objective`;--> statement-breakpoint
CREATE TABLE `__new_objective_log` (
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
INSERT INTO `__new_objective_log`("id", "value", "notes", "logged_at", "objective_id", "user_id", "created_at") SELECT "id", "value", "notes", "logged_at", "objective_id", "user_id", "created_at" FROM `objective_log`;--> statement-breakpoint
DROP TABLE `objective_log`;--> statement-breakpoint
ALTER TABLE `__new_objective_log` RENAME TO `objective_log`;--> statement-breakpoint
CREATE INDEX `logged_at_index` ON `objective_log` (`logged_at`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`bio` text,
	`location` text,
	`website` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "email", "username", "name", "avatar_url", "bio", "location", "website", "created_at") SELECT "id", "email", "username", "name", "avatar_url", "bio", "location", "website", "created_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `__new_widget` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`image_url` text,
	`image_placement` text NOT NULL,
	`text_icon` text,
	`padding` integer NOT NULL,
	`border` integer NOT NULL,
	`border_width` integer NOT NULL,
	`border_radius` integer NOT NULL,
	`color` text NOT NULL,
	`accent_color` text NOT NULL,
	`background_color` text NOT NULL,
	`watermark` integer NOT NULL,
	`objective_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget`("id", "title", "subtitle", "image_url", "image_placement", "text_icon", "padding", "border", "border_width", "border_radius", "color", "accent_color", "background_color", "watermark", "objective_id", "user_id", "created_at") SELECT "id", "title", "subtitle", "image_url", "image_placement", "text_icon", "padding", "border", "border_width", "border_radius", "color", "accent_color", "background_color", "watermark", "objective_id", "user_id", "created_at" FROM `widget`;--> statement-breakpoint
DROP TABLE `widget`;--> statement-breakpoint
ALTER TABLE `__new_widget` RENAME TO `widget`;--> statement-breakpoint
CREATE TABLE `__new_widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`value` real NOT NULL,
	`name` text,
	`calculation_type` text NOT NULL,
	`value_decimal_precision` integer NOT NULL,
	`order` integer NOT NULL,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget_metric`("id", "value", "name", "calculation_type", "value_decimal_precision", "order", "widget_id", "user_id", "created_at") SELECT "id", "value", "name", "calculation_type", "value_decimal_precision", "order", "widget_id", "user_id", "created_at" FROM `widget_metric`;--> statement-breakpoint
DROP TABLE `widget_metric`;--> statement-breakpoint
ALTER TABLE `__new_widget_metric` RENAME TO `widget_metric`;