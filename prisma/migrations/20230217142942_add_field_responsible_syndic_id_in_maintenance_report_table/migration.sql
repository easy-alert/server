-- AlterTable
ALTER TABLE "maintenancesReports" ADD COLUMN     "responsibleSyndicId" TEXT;

-- AddForeignKey
ALTER TABLE "maintenancesReports" ADD CONSTRAINT "maintenancesReports_responsibleSyndicId_fkey" FOREIGN KEY ("responsibleSyndicId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
