-- CreateTable
CREATE TABLE `ArtTerm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title_en` VARCHAR(100) NOT NULL,
    `title_uk` VARCHAR(100) NOT NULL,
    `description_en` VARCHAR(350) NOT NULL,
    `description_uk` VARCHAR(350) NOT NULL,
    `content_en` TEXT NOT NULL,
    `content_uk` TEXT NOT NULL,
    `author_id` INTEGER NOT NULL,
    `highlighted_product_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArtTerm` ADD CONSTRAINT `ArtTerm_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtTerm` ADD CONSTRAINT `ArtTerm_highlighted_product_id_fkey` FOREIGN KEY (`highlighted_product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
