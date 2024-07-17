-- CreateEnum
CREATE TYPE "MaintenanceHistoryActivityType" AS ENUM ('comment');

-- CreateTable
CREATE TABLE "maintenanceHistoryActivities" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "type" "MaintenanceHistoryActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceHistoryActivities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenanceHistoryActivities" ADD CONSTRAINT "maintenanceHistoryActivities_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
