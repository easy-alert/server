/*
  Warnings:

  - A unique constraint covering the columns `[label,companyId]` on the table `areaOfActivities` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "areaOfActivities_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "areaOfActivities_label_companyId_key" ON "areaOfActivities"("label", "companyId");
