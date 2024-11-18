/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `userCompanies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "userCompanies_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "userCompanies_userId_companyId_key" ON "userCompanies"("userId", "companyId");
