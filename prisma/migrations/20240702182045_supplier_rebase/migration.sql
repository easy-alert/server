/*
  Warnings:

  - You are about to drop the column `contractedValue` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `occupationArea` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the `supplierRegionCities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplierRegionStates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplierRegions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "supplierRegionCities" DROP CONSTRAINT "supplierRegionCities_supplierRegionId_fkey";

-- DropForeignKey
ALTER TABLE "supplierRegionStates" DROP CONSTRAINT "supplierRegionStates_supplierRegionId_fkey";

-- DropForeignKey
ALTER TABLE "supplierRegions" DROP CONSTRAINT "supplierRegions_supplierId_fkey";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "contractedValue",
DROP COLUMN "description",
DROP COLUMN "occupationArea",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cnpj" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;

-- DropTable
DROP TABLE "supplierRegionCities";

-- DropTable
DROP TABLE "supplierRegionStates";

-- DropTable
DROP TABLE "supplierRegions";

-- DropEnum
DROP TYPE "SupplierRegionType";

-- CreateTable
CREATE TABLE "supplierServiceTypes" (
    "supplierId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,

    CONSTRAINT "supplierServiceTypes_pkey" PRIMARY KEY ("supplierId","serviceTypeId")
);

-- AddForeignKey
ALTER TABLE "supplierServiceTypes" ADD CONSTRAINT "supplierServiceTypes_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplierServiceTypes" ADD CONSTRAINT "supplierServiceTypes_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "serviceTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
