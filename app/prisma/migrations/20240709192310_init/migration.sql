/*
  Warnings:

  - You are about to drop the column `createdAt` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `rentedAt` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rentals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` ADD COLUMN `penaltyEnd` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `rentals` DROP COLUMN `createdAt`,
    DROP COLUMN `rentedAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `borrowedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
