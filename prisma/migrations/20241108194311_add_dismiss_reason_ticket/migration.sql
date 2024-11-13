-- AlterTable
ALTER TABLE "tickets"
ADD COLUMN     "seen"               BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dismissObservation" TEXT,
ADD COLUMN     "dismissedById"      TEXT,
ADD COLUMN     "dismissedAt"        TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_dismissedById_fkey" FOREIGN KEY ("dismissedById") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
