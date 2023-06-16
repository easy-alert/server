-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "categoryTypeId" TEXT;

-- AlterTable
ALTER TABLE "maintenances" ADD COLUMN     "maintenanceTypeId" TEXT;

-- CreateTable
CREATE TABLE "categoryAndMaintenanceTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "singularLabel" TEXT NOT NULL,
    "pluralLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoryAndMaintenanceTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoryAndMaintenanceTypes_id_key" ON "categoryAndMaintenanceTypes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "categoryAndMaintenanceTypes_name_key" ON "categoryAndMaintenanceTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categoryAndMaintenanceTypes_singularLabel_key" ON "categoryAndMaintenanceTypes"("singularLabel");

-- CreateIndex
CREATE UNIQUE INDEX "categoryAndMaintenanceTypes_pluralLabel_key" ON "categoryAndMaintenanceTypes"("pluralLabel");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES "categoryAndMaintenanceTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_maintenanceTypeId_fkey" FOREIGN KEY ("maintenanceTypeId") REFERENCES "categoryAndMaintenanceTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
