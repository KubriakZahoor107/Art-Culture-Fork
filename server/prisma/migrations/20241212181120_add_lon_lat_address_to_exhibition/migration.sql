-- AlterTable
ALTER TABLE `Exhibition` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
