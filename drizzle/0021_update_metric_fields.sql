PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`provider` text DEFAULT 'objective' NOT NULL,
	`objective_id` text,
	`github_username` text,
	`github_stat_type` text,
	`style` text,
	`name` text,
	`value_aggregation_type` text,
	`value_display_precision` integer,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget_metric`(
  "id", "order", "provider", "objective_id", "github_username", 
  "github_stat_type", "style", "name", "value_aggregation_type", 
  "value_display_precision", "widget_id", "user_id", "created_at"
) 
SELECT 
  "id", "order", "metric_type", "objective_id", "github_username",
  "github_stat_type", "style", "name", "calculation_type",
  "value_decimal_precision", "widget_id", "user_id", "created_at" 
FROM `widget_metric`;
--> statement-breakpoint
DROP TABLE `widget_metric`;--> statement-breakpoint
ALTER TABLE `__new_widget_metric` RENAME TO `widget_metric`;--> statement-breakpoint
PRAGMA foreign_keys=ON;