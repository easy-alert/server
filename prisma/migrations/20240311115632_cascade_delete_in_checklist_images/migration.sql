-- DropForeignKey
ALTER TABLE "checklistImages" DROP CONSTRAINT "checklistImages_checklistId_fkey";

-- AddForeignKey
ALTER TABLE "checklistImages" ADD CONSTRAINT "checklistImages_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
