CREATE TABLE `user_deletion_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`reason` text NOT NULL,
	`deleted_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
ALTER TABLE `user` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `anonymized` integer DEFAULT false;