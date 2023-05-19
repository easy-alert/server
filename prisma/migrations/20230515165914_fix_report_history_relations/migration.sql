/*
  Warnings:

  - You are about to drop the column `maintenanceReportId` on the `maintenancesReportsAnnexesHistory` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceReportId` on the `maintenancesReportsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `maintenancesReportsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceReportId` on the `maintenancesReportsImagesHistory` table. All the data in the column will be lost.
  - Added the required column `maintenanceReportHistoryId` to the `maintenancesReportsAnnexesHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maintenanceReportHistoryId` to the `maintenancesReportsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maintenanceReportHistoryId` to the `maintenancesReportsImagesHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "maintenancesReportsAnnexesHistory" DROP CONSTRAINT "maintenancesReportsAnnexesHistory_maintenanceReportId_fkey";

-- DropForeignKey
ALTER TABLE "maintenancesReportsHistory" DROP CONSTRAINT "maintenancesReportsHistory_maintenanceReportId_fkey";

-- DropForeignKey
ALTER TABLE "maintenancesReportsImagesHistory" DROP CONSTRAINT "maintenancesReportsImagesHistory_maintenanceReportId_fkey";

-- AlterTable
ALTER TABLE "maintenancesReportsAnnexesHistory" DROP COLUMN "maintenanceReportId",
ADD COLUMN     "maintenanceReportHistoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "maintenancesReportsHistory" DROP COLUMN "maintenanceReportId",
DROP COLUMN "version",
ADD COLUMN     "maintenanceReportHistoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "maintenancesReportsImagesHistory" DROP COLUMN "maintenanceReportId",
ADD COLUMN     "maintenanceReportHistoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_maintenanceReportHistoryId_fkey" FOREIGN KEY ("maintenanceReportHistoryId") REFERENCES "maintenancesReports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsAnnexesHistory" ADD CONSTRAINT "maintenancesReportsAnnexesHistory_maintenanceReportHistory_fkey" FOREIGN KEY ("maintenanceReportHistoryId") REFERENCES "maintenancesReportsHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsImagesHistory" ADD CONSTRAINT "maintenancesReportsImagesHistory_maintenanceReportHistoryI_fkey" FOREIGN KEY ("maintenanceReportHistoryId") REFERENCES "maintenancesReportsHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
