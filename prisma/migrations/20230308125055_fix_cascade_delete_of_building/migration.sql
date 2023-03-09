-- DropForeignKey
ALTER TABLE "buildingsCategories" DROP CONSTRAINT "buildingsCategories_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "buildingsCategories" DROP CONSTRAINT "buildingsCategories_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsCategories" ADD CONSTRAINT "buildingsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
