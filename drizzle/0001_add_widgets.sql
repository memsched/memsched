CREATE TABLE `widget` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`image_url` text,
	`image_placement` text NOT NULL,
	`padding` integer NOT NULL,
	`border` integer NOT NULL,
	`border_width` integer NOT NULL,
	`border_radius` integer NOT NULL,
	`color` text NOT NULL,
	`accent_color` text NOT NULL,
	`background_color` text NOT NULL,
	`watermark` integer NOT NULL,
	`objective_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL,
	`description` text,
	`time_range` text NOT NULL,
	`value_decimal_precision` integer NOT NULL,
	`widget_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade
);
