/*
  Warnings:

  - You are about to drop the column `syndicId` on the `checklists` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `checklists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_syndicId_fkey";

-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_userId_fkey";

-- AlterTable
ALTER TABLE "checklists" DROP COLUMN "syndicId",
DROP COLUMN "userId",
ADD COLUMN     "finishedById" TEXT;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_finishedById_fkey" FOREIGN KEY ("finishedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
