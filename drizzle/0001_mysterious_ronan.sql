CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`primary_name` text NOT NULL,
	`phone` text,
	`response_note` text,
	`responded_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_code_unique` ON `invitations` (`code`);--> statement-breakpoint
CREATE TABLE `invitees` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_id` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text NOT NULL,
	`sort_order` integer NOT NULL,
	`attendance` text DEFAULT 'pendente' NOT NULL,
	`confirmed_at` integer,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
