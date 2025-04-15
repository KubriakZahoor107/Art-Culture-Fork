-- AlterTable
ALTER TABLE `Like` ADD COLUMN `likedUserId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_likedUserId_fkey` FOREIGN KEY (`likedUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
