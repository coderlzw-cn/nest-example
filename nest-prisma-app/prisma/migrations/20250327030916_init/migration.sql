/*
  Warnings:

  - You are about to drop the column `teacherId` on the `student` table. All the data in the column will be lost.
  - Added the required column `teacher_id` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `teacherId`,
    ADD COLUMN `teacher_id` VARCHAR(191) NOT NULL;
