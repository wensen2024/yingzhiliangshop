ALTER TABLE `orders` ADD `paymentProofUrl` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `proofVerified` enum('pending','verified','rejected') DEFAULT 'pending' NOT NULL;