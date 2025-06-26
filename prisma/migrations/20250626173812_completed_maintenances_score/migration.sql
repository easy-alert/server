-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "completedMaintenanceScore" INTEGER,
ADD COLUMN     "completedMaintenanceScoreCalculatedAt" TIMESTAMP(3);
