-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('REGISTRATION', 'INCOMING', 'OUTGOING', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'LOSS', 'DAMAGED', 'DELETED', 'REMOVAL');

-- CreateTable
CREATE TABLE "stockItemTypes" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "buildingId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockItemTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stockItems" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "buildingId" TEXT,
    "stockItemTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "createdById" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minimumQuantity" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "notes" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stockMovements" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "stockItemId" TEXT NOT NULL,
    "lastUpdatedById" TEXT,
    "transferToId" TEXT,
    "quantity" INTEGER NOT NULL,
    "previousBalance" INTEGER NOT NULL,
    "newBalance" INTEGER NOT NULL,
    "referenceNumber" TEXT,
    "notes" TEXT,
    "movementType" "StockMovementType" NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stockMovements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stockItemTypes_name_key" ON "stockItemTypes"("name");

-- CreateIndex
CREATE INDEX "stockItemTypes_companyId_idx" ON "stockItemTypes"("companyId");

-- CreateIndex
CREATE INDEX "stockItemTypes_buildingId_idx" ON "stockItemTypes"("buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "stockItemTypes_companyId_name_buildingId_key" ON "stockItemTypes"("companyId", "name", "buildingId");

-- CreateIndex
CREATE INDEX "stockItems_companyId_idx" ON "stockItems"("companyId");

-- CreateIndex
CREATE INDEX "stockItems_buildingId_idx" ON "stockItems"("buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "stockItems_companyId_name_buildingId_key" ON "stockItems"("companyId", "name", "buildingId");

-- CreateIndex
CREATE INDEX "stocks_stockItemId_idx" ON "stocks"("stockItemId");

-- CreateIndex
CREATE INDEX "stocks_buildingId_idx" ON "stocks"("buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_buildingId_stockItemId_key" ON "stocks"("buildingId", "stockItemId");

-- CreateIndex
CREATE INDEX "stockMovements_stockItemId_idx" ON "stockMovements"("stockItemId");

-- CreateIndex
CREATE INDEX "stockMovements_stockId_idx" ON "stockMovements"("stockId");

-- CreateIndex
CREATE INDEX "stockMovements_lastUpdatedById_idx" ON "stockMovements"("lastUpdatedById");

-- CreateIndex
CREATE INDEX "stockMovements_movementDate_idx" ON "stockMovements"("movementDate");

-- AddForeignKey
ALTER TABLE "stockItemTypes" ADD CONSTRAINT "stockItemTypes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItemTypes" ADD CONSTRAINT "stockItemTypes_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItems" ADD CONSTRAINT "stockItems_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItems" ADD CONSTRAINT "stockItems_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockItems" ADD CONSTRAINT "stockItems_stockItemTypeId_fkey" FOREIGN KEY ("stockItemTypeId") REFERENCES "stockItemTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "stockItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "stockItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_lastUpdatedById_fkey" FOREIGN KEY ("lastUpdatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_transferToId_fkey" FOREIGN KEY ("transferToId") REFERENCES "buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
