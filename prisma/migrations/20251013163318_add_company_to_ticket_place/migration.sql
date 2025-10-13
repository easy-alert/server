-- AlterTable
ALTER TABLE "ticketPlaces" ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "ticketPlaces" ADD CONSTRAINT "ticketPlaces_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
