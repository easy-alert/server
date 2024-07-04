-- AlterTable
ALTER TABLE "maintenancesHistory" ADD COLUMN     "supplierId" TEXT;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
