-- CreateEnum
CREATE TYPE "MaintenanceReportPdfStatusName" AS ENUM ('pending', 'finished', 'failed');

-- CreateTable
CREATE TABLE "maintenanceReportPdfs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MaintenanceReportPdfStatusName" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenanceReportPdfs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenanceReportPdfs" ADD CONSTRAINT "maintenanceReportPdfs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
