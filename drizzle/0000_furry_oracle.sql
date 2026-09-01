CREATE TABLE IF NOT EXISTS `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`companion` text,
	`allowed_guests` integer DEFAULT 1 NOT NULL
);
