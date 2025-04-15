-- AlterTable
ALTER TABLE `Exhibition` MODIFY `title_en` VARCHAR(150) NULL,
    MODIFY `title_uk` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title_en` VARCHAR(150) NOT NULL,
    MODIFY `title_uk` VARCHAR(150) NOT NULL,
    MODIFY `content_en` VARCHAR(1000) NOT NULL,
    MODIFY `content_uk` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `title_en` VARCHAR(100) NOT NULL,
    MODIFY `title_uk` VARCHAR(100) NOT NULL,
    MODIFY `description_en` VARCHAR(1000) NOT NULL,
    MODIFY `description_uk` VARCHAR(1000) NOT NULL;
