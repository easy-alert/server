/*
  Warnings:

  - You are about to drop the column `maintenanceReportHistoryId` on the `maintenancesReportsHistory` table. All the data in the column will be lost.
  - Added the required column `maintenanceReportId` to the `maintenancesReportsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "maintenancesReportsHistory" DROP CONSTRAINT "maintenancesReportsHistory_maintenanceReportHistoryId_fkey";

-- AlterTable
ALTER TABLE "maintenancesReportsHistory" DROP COLUMN "maintenanceReportHistoryId",
ADD COLUMN     "maintenanceReportId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
