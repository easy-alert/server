/*
  Warnings:

  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_userId_fkey";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "userCompanies" ADD COLUMN     "owner" BOOLEAN NOT NULL DEFAULT false;
