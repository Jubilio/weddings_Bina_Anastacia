CREATE TABLE `gift_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`gift_key` text NOT NULL,
	`invitation_id` text NOT NULL,
	`status` text DEFAULT 'reservado' NOT NULL,
	`reserved_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gift_reservations_gift_key_unique` ON `gift_reservations` (`gift_key`);--> statement-breakpoint
CREATE TABLE `security_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`window_started_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `invitations` ADD `checked_in_at` integer;