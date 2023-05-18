/*
  Warnings:

  - You are about to drop the column `buildingNotificationConfigurationId` on the `maintenancesReportsHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "maintenancesReportsHistory" DROP CONSTRAINT "maintenancesReportsHistory_buildingNotificationConfigurati_fkey";

-- AlterTable
ALTER TABLE "maintenancesReportsHistory" DROP COLUMN "buildingNotificationConfigurationId";
