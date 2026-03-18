CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`productId` varchar(64) NOT NULL,
	`productName` text NOT NULL,
	`paymentMethod` enum('alipay','usdc') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(8) NOT NULL,
	`txHash` text,
	`status` enum('pending','delivered','failed') NOT NULL DEFAULT 'pending',
	`deliveredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
