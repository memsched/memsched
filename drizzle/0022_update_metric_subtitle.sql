PRAGMA foreign_keys=OFF;--> statement-breakpoint
-- First update any NULL values to empty strings
UPDATE `widget` SET `subtitle` = '' WHERE `subtitle` IS NULL;
--> statement-breakpoint
CREATE TABLE `__new_widget` (
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
INSERT INTO `__new_widget`("id", "title", "subtitle", "image_url", "image_placement", "text_icon", "visibility", "padding", "border", "border_width", "border_radius", "color", "accent_color", "background_color", "watermark", "user_id", "created_at") SELECT "id", "title", "subtitle", "image_url", "image_placement", "text_icon", "visibility", "padding", "border", "border_width", "border_radius", "color", "accent_color", "background_color", "watermark", "user_id", "created_at" FROM `widget`;--> statement-breakpoint
DROP TABLE `widget`;--> statement-breakpoint
ALTER TABLE `__new_widget` RENAME TO `widget`;--> statement-breakpoint
PRAGMA foreign_keys=ON;