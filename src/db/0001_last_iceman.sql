ALTER TABLE `users` MODIFY COLUMN `username` varchar(191) NOT NULL;--> statement-breakpoint
CREATE INDEX `username_idx` ON `users` (`username`);