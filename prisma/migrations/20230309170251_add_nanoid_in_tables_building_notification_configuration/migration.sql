/*
  Warnings:

  - A unique constraint covering the columns `[nanoId]` on the table `buildings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nanoId]` on the table `buildingsNotificationsConfigurations` will be added. If there are existing duplicate values, this will fail.
  - The required column `nanoId` was added to the `buildings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `nanoId` was added to the `buildingsNotificationsConfigurations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "buildings" ADD COLUMN     "nanoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "buildingsNotificationsConfigurations" ADD COLUMN     "nanoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "buildings_nanoId_key" ON "buildings"("nanoId");

-- CreateIndex
CREATE UNIQUE INDEX "buildingsNotificationsConfigurations_nanoId_key" ON "buildingsNotificationsConfigurations"("nanoId");
