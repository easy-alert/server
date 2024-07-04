/*
  Warnings:

  - You are about to drop the column `companyId` on the `maintenanceSuppliers` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `maintenancesHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[maintenanceId,supplierId]` on the table `maintenanceSuppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "maintenancesHistory" DROP CONSTRAINT "maintenancesHistory_supplierId_fkey";

-- DropIndex
DROP INDEX "maintenanceSuppliers_maintenanceId_companyId_supplierId_key";

-- AlterTable
ALTER TABLE "maintenanceSuppliers" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "maintenancesHistory" DROP COLUMN "supplierId";

-- CreateTable
CREATE TABLE "maintenanceHistorySuppliers" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceHistorySuppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceHistorySuppliers_maintenanceHistoryId_supplierId_key" ON "maintenanceHistorySuppliers"("maintenanceHistoryId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceSuppliers_maintenanceId_supplierId_key" ON "maintenanceSuppliers"("maintenanceId", "supplierId");

-- AddForeignKey
ALTER TABLE "maintenanceHistorySuppliers" ADD CONSTRAINT "maintenanceHistorySuppliers_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceHistorySuppliers" ADD CONSTRAINT "maintenanceHistorySuppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
