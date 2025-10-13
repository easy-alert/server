-- AlterTable
ALTER TABLE "serviceTypes" ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "serviceTypes" ADD CONSTRAINT "serviceTypes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
