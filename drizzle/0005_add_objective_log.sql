CREATE TABLE `objective_log` (
	`id` text PRIMARY KEY NOT NULL,
	`objective_id` text NOT NULL,
	`user_id` text NOT NULL,
	`value` real NOT NULL,
	`notes` text,
	`logged_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_objective`("id", "name", "description", "start_value", "value", "unit", "visibility", "goal_type", "end_value", "user_id", "created_at") SELECT "id", "name", "description", "start_value", "value", "unit", "visibility", "goal_type", "end_value", "user_id", "created_at" FROM `objective`;--> statement-breakpoint
DROP TABLE `objective`;--> statement-breakpoint
ALTER TABLE `__new_objective` RENAME TO `objective`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`value` real NOT NULL,
	`name` text,
	`time_range` text NOT NULL,
	`value_decimal_precision` integer NOT NULL,
	`order` integer NOT NULL,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget_metric`("id", "value", "name", "time_range", "value_decimal_precision", "order", "widget_id", "user_id", "created_at") SELECT "id", "value", "name", "time_range", "value_decimal_precision", "order", "widget_id", "user_id", "created_at" FROM `widget_metric`;--> statement-breakpoint
DROP TABLE `widget_metric`;--> statement-breakpoint
ALTER TABLE `__new_widget_metric` RENAME TO `widget_metric`;