-- CreateTable
CREATE TABLE "maintenanceSuppliers" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceSuppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceSuppliers_maintenanceId_companyId_supplierId_key" ON "maintenanceSuppliers"("maintenanceId", "companyId", "supplierId");

-- AddForeignKey
ALTER TABLE "maintenanceSuppliers" ADD CONSTRAINT "maintenanceSuppliers_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceSuppliers" ADD CONSTRAINT "maintenanceSuppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
