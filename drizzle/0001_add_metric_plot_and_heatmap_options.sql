PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_widget_metric` (
	`id` text PRIMARY KEY NOT NULL,
	`order` integer NOT NULL,
	`provider` text DEFAULT 'objective' NOT NULL,
	`objective_id` text,
	`github_username` text,
	`github_stat_type` text,
	`style` text DEFAULT 'metric-base' NOT NULL,
	`value_name` text,
	`value_period` text,
	`value_display_precision` integer,
	`value_percent` integer,
	`plot_period` text,
	`plot_interval` text,
	`heatmap_period` text,
	`heatmap_interval` text,
	`widget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`objective_id`) REFERENCES `objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`widget_id`) REFERENCES `widget`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_widget_metric`(`id`, `order`, `provider`, `objective_id`, `github_username`, `github_stat_type`, `style`, `value_name`, `value_period`, `value_display_precision`, `value_percent`, `plot_period`, `plot_interval`, `heatmap_period`, `heatmap_interval`, `widget_id`, `user_id`, `created_at`) 
SELECT `id`, `order`, `provider`, `objective_id`, `github_username`, `github_stat_type`, `style`, `name`, `period`, `value_display_precision`, `value_percent`, 'week', 'day', 'month', 'day', `widget_id`, `user_id`, `created_at` 
FROM `widget_metric`;--> statement-breakpoint
DROP TABLE `widget_metric`;--> statement-breakpoint
ALTER TABLE `__new_widget_metric` RENAME TO `widget_metric`;--> statement-breakpoint
PRAGMA foreign_keys=ON;