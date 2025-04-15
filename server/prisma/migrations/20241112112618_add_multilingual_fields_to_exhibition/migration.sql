/*
  Warnings:

  - You are about to drop the column `description` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Exhibition` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Exhibition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exhibition` DROP COLUMN `description`,
    DROP COLUMN `location`,
    DROP COLUMN `title`,
    ADD COLUMN `description_en` VARCHAR(191) NULL,
    ADD COLUMN `description_uk` VARCHAR(191) NULL,
    ADD COLUMN `location_en` VARCHAR(191) NULL,
    ADD COLUMN `location_uk` VARCHAR(191) NULL,
    ADD COLUMN `title_en` VARCHAR(191) NULL,
    ADD COLUMN `title_uk` VARCHAR(191) NULL;
