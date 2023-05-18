/*
  Warnings:

  - You are about to drop the column `responsibleSyndicId` on the `maintenancesReportsHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "maintenancesReportsHistory" DROP CONSTRAINT "maintenancesReportsHistory_responsibleSyndicId_fkey";

-- AlterTable
ALTER TABLE "maintenancesReportsHistory" DROP COLUMN "responsibleSyndicId",
ADD COLUMN     "buildingNotificationConfigurationId" TEXT;

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_buildingNotificationConfigurati_fkey" FOREIGN KEY ("buildingNotificationConfigurationId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
