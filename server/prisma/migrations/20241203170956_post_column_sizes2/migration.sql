/*
  Warnings:

  - You are about to alter the column `time` on the `Exhibition` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_en` on the `Exhibition` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_uk` on the `Exhibition` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_en` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_uk` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_en` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `title_uk` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `Exhibition` MODIFY `time` VARCHAR(50) NULL,
    MODIFY `description_en` VARCHAR(500) NULL,
    MODIFY `description_uk` VARCHAR(500) NULL,
    MODIFY `location_en` VARCHAR(200) NULL,
    MODIFY `location_uk` VARCHAR(200) NULL,
    MODIFY `title_en` VARCHAR(50) NULL,
    MODIFY `title_uk` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title_en` VARCHAR(50) NOT NULL,
    MODIFY `title_uk` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `title_en` VARCHAR(50) NOT NULL,
    MODIFY `title_uk` VARCHAR(50) NOT NULL,
    MODIFY `description_en` VARCHAR(500) NOT NULL,
    MODIFY `description_uk` VARCHAR(500) NOT NULL,
    MODIFY `specs_en` VARCHAR(500) NULL,
    MODIFY `specs_uk` VARCHAR(500) NULL;
