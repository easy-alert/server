/*
  Warnings:

  - You are about to drop the `supplierServiceTypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "supplierServiceTypes" DROP CONSTRAINT "supplierServiceTypes_serviceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "supplierServiceTypes" DROP CONSTRAINT "supplierServiceTypes_supplierId_fkey";

-- DropTable
DROP TABLE "supplierServiceTypes";

-- CreateTable
CREATE TABLE "supplierAreaOfActivities" (
    "supplierId" TEXT NOT NULL,
    "areaOfActivityId" TEXT NOT NULL,

    CONSTRAINT "supplierAreaOfActivities_pkey" PRIMARY KEY ("supplierId","areaOfActivityId")
);

-- CreateTable
CREATE TABLE "areaOfActivities" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "areaOfActivities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areaOfActivities_label_key" ON "areaOfActivities"("label");

-- AddForeignKey
ALTER TABLE "supplierAreaOfActivities" ADD CONSTRAINT "supplierAreaOfActivities_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplierAreaOfActivities" ADD CONSTRAINT "supplierAreaOfActivities_areaOfActivityId_fkey" FOREIGN KEY ("areaOfActivityId") REFERENCES "areaOfActivities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areaOfActivities" ADD CONSTRAINT "areaOfActivities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
