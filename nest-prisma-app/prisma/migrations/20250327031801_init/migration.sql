-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
