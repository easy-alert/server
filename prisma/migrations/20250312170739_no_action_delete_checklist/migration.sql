-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_templateId_fkey";

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklistTemplates"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
