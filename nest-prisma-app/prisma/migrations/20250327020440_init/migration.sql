/*
  Warnings:

  - Added the required column `teacherId` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `teacherId` VARCHAR(191) NOT NULL;
