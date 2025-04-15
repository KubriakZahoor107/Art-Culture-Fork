-- DropForeignKey
ALTER TABLE `ExhibitionImage` DROP FOREIGN KEY `ExhibitionImage_exhibitionId_fkey`;

-- AddForeignKey
ALTER TABLE `ExhibitionImage` ADD CONSTRAINT `ExhibitionImage_exhibitionId_fkey` FOREIGN KEY (`exhibitionId`) REFERENCES `Exhibition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
