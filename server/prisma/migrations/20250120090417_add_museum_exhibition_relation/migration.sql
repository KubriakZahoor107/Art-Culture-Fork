-- AlterTable
ALTER TABLE `Exhibition` ADD COLUMN `museumId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Exhibition` ADD CONSTRAINT `Exhibition_museumId_fkey` FOREIGN KEY (`museumId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
