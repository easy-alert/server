-- CreateEnum
CREATE TYPE "NextMaintenanceCreationBasis" AS ENUM ('executionDate', 'notificationDate');

-- AlterTable
ALTER TABLE "buildings" ADD COLUMN     "nextMaintenanceCreationBasis" "NextMaintenanceCreationBasis" NOT NULL DEFAULT 'executionDate';
