-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_maintenanceHistoryId_fkey";

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
