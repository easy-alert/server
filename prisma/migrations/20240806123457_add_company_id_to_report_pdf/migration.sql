/*
  Warnings:

  - Added the required column `authorCompanyId` to the `maintenanceReportPdfs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "maintenanceReportPdfs" ADD COLUMN     "authorCompanyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "maintenanceReportPdfs" ADD CONSTRAINT "maintenanceReportPdfs_authorCompanyId_fkey" FOREIGN KEY ("authorCompanyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
