/*
  Warnings:

  - The values [Exhibition] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'MUSEUM', 'CREATOR', 'EDITOR', 'AUTHOR', 'EXHIBITION') NOT NULL DEFAULT 'USER';
