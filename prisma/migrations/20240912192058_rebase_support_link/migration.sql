/*
  Warnings:

  - You are about to drop the column `supportLink` on the `companies` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyTicketType" AS ENUM ('none', 'whatsapp', 'email', 'link', 'platform');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "supportLink",
ADD COLUMN     "ticketInfo" TEXT,
ADD COLUMN     "ticketType" "CompanyTicketType" NOT NULL DEFAULT 'platform';
