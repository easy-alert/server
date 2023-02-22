-- AlterTable
ALTER TABLE "buildingsNotificationsConfigurations" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "buildingsCategories" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingsMaintenances" (
    "id" TEXT NOT NULL,
    "buildingCategoryId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsMaintenances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingsCategories_id_key" ON "buildingsCategories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "buildingsMaintenances_id_key" ON "buildingsMaintenances"("id");

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsMaintenances" ADD CONSTRAINT "buildingsMaintenances_buildingCategoryId_fkey" FOREIGN KEY ("buildingCategoryId") REFERENCES "buildingsCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsMaintenances" ADD CONSTRAINT "buildingsMaintenances_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
