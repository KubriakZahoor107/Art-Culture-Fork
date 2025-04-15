/*
  Warnings:

  - Made the column `title_en` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title_uk` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content_en` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content_uk` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `title_en` VARCHAR(191) NOT NULL,
    MODIFY `title_uk` VARCHAR(191) NOT NULL,
    MODIFY `content_en` VARCHAR(500) NOT NULL,
    MODIFY `content_uk` VARCHAR(500) NOT NULL;
