/*
  Warnings:

  - Added the required column `element` to the `maintenances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delayTimeIntervalId` to the `maintenancesHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequencyTimeIntervalId` to the `maintenancesHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodTimeIntervalId` to the `maintenancesHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "maintenances" ADD COLUMN     "element" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "maintenancesHistory" ADD COLUMN     "delayTimeIntervalId" TEXT NOT NULL,
ADD COLUMN     "frequencyTimeIntervalId" TEXT NOT NULL,
ADD COLUMN     "periodTimeIntervalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "timeIntervals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeIntervals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_id_key" ON "timeIntervals"("id");

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_name_key" ON "timeIntervals"("name");

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_frequencyTimeIntervalId_fkey" FOREIGN KEY ("frequencyTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_periodTimeIntervalId_fkey" FOREIGN KEY ("periodTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_delayTimeIntervalId_fkey" FOREIGN KEY ("delayTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
