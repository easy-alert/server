-- AlterTable
ALTER TABLE "maintenancesReports" ADD COLUMN     "origin" TEXT NOT NULL DEFAULT 'Company';

-- AlterTable
ALTER TABLE "maintenancesReportsHistory" ADD COLUMN     "origin" TEXT NOT NULL DEFAULT 'Company';
