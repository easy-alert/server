-- DropForeignKey
ALTER TABLE "maintenancesReports" DROP CONSTRAINT "maintenancesReports_responsibleSyndicId_fkey";

-- AddForeignKey
ALTER TABLE "maintenancesReports" ADD CONSTRAINT "maintenancesReports_responsibleSyndicId_fkey" FOREIGN KEY ("responsibleSyndicId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
