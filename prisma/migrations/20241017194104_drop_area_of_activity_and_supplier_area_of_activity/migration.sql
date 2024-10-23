/*
  Warnings:

  - You are about to drop the `areaOfActivities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplierAreaOfActivities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "areaOfActivities" DROP CONSTRAINT "areaOfActivities_companyId_fkey";

-- DropForeignKey
ALTER TABLE "supplierAreaOfActivities" DROP CONSTRAINT "supplierAreaOfActivities_areaOfActivityId_fkey";

-- DropForeignKey
ALTER TABLE "supplierAreaOfActivities" DROP CONSTRAINT "supplierAreaOfActivities_supplierId_fkey";

-- DropTable
DROP TABLE "areaOfActivities";

-- DropTable
DROP TABLE "supplierAreaOfActivities";
