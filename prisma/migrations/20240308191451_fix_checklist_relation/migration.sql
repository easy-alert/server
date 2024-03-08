/*
  Warnings:

  - The required column `groupId` was added to the `checklists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `syndicId` on table `checklists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_parentId_fkey";

-- AlterTable
ALTER TABLE "checklists" ADD COLUMN     "groupId" TEXT NOT NULL,
ALTER COLUMN "syndicId" SET NOT NULL;
