/*
  Warnings:

  - You are about to drop the column `userId` on the `maintenancesHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "maintenancesHistory" DROP CONSTRAINT "maintenancesHistory_userId_fkey";

-- AlterTable
ALTER TABLE "maintenancesHistory" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "maintenanceHistoryUsers" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceHistoryUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceHistoryUsers_id_key" ON "maintenanceHistoryUsers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceHistoryUsers_maintenanceHistoryId_userId_key" ON "maintenanceHistoryUsers"("maintenanceHistoryId", "userId");

-- AddForeignKey
ALTER TABLE "maintenanceHistoryUsers" ADD CONSTRAINT "maintenanceHistoryUsers_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceHistoryUsers" ADD CONSTRAINT "maintenanceHistoryUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
