-- DropForeignKey
ALTER TABLE `orderproduct` DROP FOREIGN KEY `OrderProduct_orderId_fkey`;

-- AddForeignKey
ALTER TABLE `OrderProduct` ADD CONSTRAINT `OrderProduct_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
