-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_syndicId_fkey";

-- AlterTable
ALTER TABLE "checklists" ALTER COLUMN "syndicId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
