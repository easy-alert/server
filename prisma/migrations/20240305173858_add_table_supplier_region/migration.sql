-- CreateEnum
CREATE TYPE "SupplierRegionType" AS ENUM ('country', 'state', 'city');

-- CreateTable
CREATE TABLE "supplierRegions" (
    "id" TEXT NOT NULL,
    "type" "SupplierRegionType" NOT NULL,
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplierRegions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplierRegionStates" (
    "id" TEXT NOT NULL,
    "supplierRegionId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplierRegionStates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplierRegionCities" (
    "id" TEXT NOT NULL,
    "supplierRegionId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplierRegionCities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplierRegions_id_key" ON "supplierRegions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "supplierRegionStates_id_key" ON "supplierRegionStates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "supplierRegionCities_id_key" ON "supplierRegionCities"("id");

-- AddForeignKey
ALTER TABLE "supplierRegions" ADD CONSTRAINT "supplierRegions_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplierRegionStates" ADD CONSTRAINT "supplierRegionStates_supplierRegionId_fkey" FOREIGN KEY ("supplierRegionId") REFERENCES "supplierRegions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplierRegionCities" ADD CONSTRAINT "supplierRegionCities_supplierRegionId_fkey" FOREIGN KEY ("supplierRegionId") REFERENCES "supplierRegions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
