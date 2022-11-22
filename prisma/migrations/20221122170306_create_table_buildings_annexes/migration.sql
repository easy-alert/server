-- DropForeignKey
ALTER TABLE "buildingsCategories" DROP CONSTRAINT "buildingsCategories_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "buildingsCategories" DROP CONSTRAINT "buildingsCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "buildingsMaintenances" DROP CONSTRAINT "buildingsMaintenances_maintenanceId_fkey";

-- CreateTable
CREATE TABLE "buildingsAnnexes" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsAnnexes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingsAnnexes_id_key" ON "buildingsAnnexes"("id");

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsMaintenances" ADD CONSTRAINT "buildingsMaintenances_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsAnnexes" ADD CONSTRAINT "buildingsAnnexes_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
