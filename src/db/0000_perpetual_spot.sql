CREATE TABLE `followers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`followerId` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `followers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`userId` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`senderId` varchar(191) NOT NULL,
	`receiverId` varchar(191) NOT NULL,
	`read` boolean DEFAULT false,
	`type` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`userId` varchar(191),
	`threadId` int,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reposts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`reposterId` varchar(191) NOT NULL,
	CONSTRAINT `reposts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`authorId` varchar(191) NOT NULL,
	`parentId` int,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `threads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`clerkId` varchar(191) NOT NULL,
	`bio` text,
	`image` text NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`isEedited` boolean DEFAULT false,
	`onboarded` boolean DEFAULT false,
	`isPrivate` boolean DEFAULT false,
	`role` text DEFAULT ('USER'),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_clerkId_unique` UNIQUE(`clerkId`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `followers` (`userId`);--> statement-breakpoint
CREATE INDEX `followerId_idx` ON `followers` (`followerId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `likes` (`userId`);--> statement-breakpoint
CREATE INDEX `threadId_idx` ON `likes` (`threadId`);--> statement-breakpoint
CREATE INDEX `senderId_idx` ON `notifications` (`senderId`);--> statement-breakpoint
CREATE INDEX `receiverId_idx` ON `notifications` (`receiverId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `threadId_idx` ON `notifications` (`threadId`);--> statement-breakpoint
CREATE INDEX `reposterId_idx` ON `reposts` (`reposterId`);--> statement-breakpoint
CREATE INDEX `threadId_idx` ON `reposts` (`threadId`);--> statement-breakpoint
CREATE INDEX `authorId_idx` ON `threads` (`authorId`);--> statement-breakpoint
CREATE INDEX `parentId_idx` ON `threads` (`parentId`);--> statement-breakpoint
CREATE INDEX `clerkId_idx` ON `users` (`clerkId`);