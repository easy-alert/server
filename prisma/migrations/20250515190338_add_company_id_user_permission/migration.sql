/*
  Warnings:

  - A unique constraint covering the columns `[companyId,userId,permissionId]` on the table `userPermissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "userPermissions_userId_permissionId_key";

-- AlterTable
ALTER TABLE "userPermissions" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "userPermissions_companyId_userId_permissionId_key" ON "userPermissions"("companyId", "userId", "permissionId");

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
