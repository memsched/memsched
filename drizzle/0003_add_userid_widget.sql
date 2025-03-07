ALTER TABLE `widget` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `widget_metric` ADD `user_id` text NOT NULL REFERENCES user(id);