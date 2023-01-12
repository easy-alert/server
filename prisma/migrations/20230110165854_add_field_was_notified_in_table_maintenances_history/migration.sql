/*
  Warnings:

  - You are about to drop the column `maintenancesStatusId` on the `maintenancesHistory` table. All the data in the column will be lost.
  - Added the required column `maintenanceStatusId` to the `maintenancesHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "maintenancesHistory" DROP CONSTRAINT "maintenancesHistory_maintenancesStatusId_fkey";

-- AlterTable
ALTER TABLE "maintenancesHistory" DROP COLUMN "maintenancesStatusId",
ADD COLUMN     "maintenanceStatusId" TEXT NOT NULL,
ADD COLUMN     "wasNotified" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_maintenanceStatusId_fkey" FOREIGN KEY ("maintenanceStatusId") REFERENCES "maintenancesStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
