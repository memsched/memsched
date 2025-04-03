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
