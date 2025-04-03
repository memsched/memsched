PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`value` real NOT NULL,
	`name` text,
	`calculation_type` text NOT NULL,
	`value_decimal_precision` integer NOT NULL,
	`metric_type` text DEFAULT 'objective' NOT NULL,
	`github_username` text,
	`order` integer NOT NULL,
	`objective_id` text,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget_metric`(
  "id", "value", "name", "calculation_type", "value_decimal_precision", 
  "order", "objective_id", "widget_id", "user_id", "created_at"
) SELECT 
  "id", "value", "name", "calculation_type", "value_decimal_precision", 
  "order", "objective_id", "widget_id", "user_id", "created_at" 
FROM `widget_metric`;
--> statement-breakpoint
DROP TABLE `widget_metric`;
--> statement-breakpoint
ALTER TABLE `__new_widget_metric` RENAME TO `widget_metric`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;