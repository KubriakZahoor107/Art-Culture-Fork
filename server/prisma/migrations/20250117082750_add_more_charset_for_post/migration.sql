-- AlterTable
ALTER TABLE `Post` MODIFY `title_en` VARCHAR(250) NOT NULL,
    MODIFY `title_uk` VARCHAR(250) NOT NULL,
    MODIFY `content_en` VARCHAR(5000) NOT NULL,
    MODIFY `content_uk` VARCHAR(5000) NOT NULL;
