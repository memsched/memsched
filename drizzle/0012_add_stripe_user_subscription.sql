ALTER TABLE `user` ADD `stripe_customer_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `subscription_status` text DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE `user` ADD `stripe_plan_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `subscription_period_end` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `cancel_at_period_end` integer DEFAULT false;
