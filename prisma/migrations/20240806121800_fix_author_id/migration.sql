/*
  Warnings:

  - You are about to drop the column `userId` on the `maintenanceReportPdfs` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `maintenanceReportPdfs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "maintenanceReportPdfs" DROP CONSTRAINT "maintenanceReportPdfs_userId_fkey";

-- AlterTable
ALTER TABLE "maintenanceReportPdfs" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "maintenanceReportPdfs" ADD CONSTRAINT "maintenanceReportPdfs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
