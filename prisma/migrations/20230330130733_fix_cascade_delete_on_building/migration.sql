-- DropForeignKey
ALTER TABLE "buildingsMaintenances" DROP CONSTRAINT "buildingsMaintenances_maintenanceId_fkey";

-- AddForeignKey
ALTER TABLE "buildingsMaintenances" ADD CONSTRAINT "buildingsMaintenances_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
