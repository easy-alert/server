-- AlterTable
ALTER TABLE "checklistTemplates" ADD COLUMN     "companyId" TEXT NOT NULL DEFAULT '248573d2-5927-4ff1-aeff-4de8bf1144cb';

-- AddForeignKey
ALTER TABLE "checklistTemplates" ADD CONSTRAINT "checklistTemplates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
