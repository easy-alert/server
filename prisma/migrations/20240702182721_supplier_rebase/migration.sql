/*
  Warnings:

  - Added the required column `companyId` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
