-- CreateTable
CREATE TABLE `ExhibitionProduct` (
    `exhibitionId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `ExhibitionProduct_productId_fkey`(`productId`),
    PRIMARY KEY (`exhibitionId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Product_museumId_fkey` ON `Product`(`museumId`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_museumId_fkey` FOREIGN KEY (`museumId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExhibitionProduct` ADD CONSTRAINT `ExhibitionProduct_exhibitionId_fkey` FOREIGN KEY (`exhibitionId`) REFERENCES `Exhibition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExhibitionProduct` ADD CONSTRAINT `ExhibitionProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
