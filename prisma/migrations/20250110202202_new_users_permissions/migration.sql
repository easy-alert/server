/*
  Warnings:

  - A unique constraint covering the columns `[userId,permissionId]` on the table `userPermissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "userPermissions" DROP CONSTRAINT "userPermissions_permissionId_fkey";

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "label" TEXT,
ADD COLUMN     "moduleName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "userPermissions_userId_permissionId_key" ON "userPermissions"("userId", "permissionId");

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
