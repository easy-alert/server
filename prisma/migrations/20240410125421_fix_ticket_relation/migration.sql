/*
  Warnings:

  - Added the required column `buildingId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ticketServiceTypes" DROP CONSTRAINT "ticketServiceTypes_serviceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ticketServiceTypes" DROP CONSTRAINT "ticketServiceTypes_ticketId_fkey";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "buildingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketServiceTypes" ADD CONSTRAINT "ticketServiceTypes_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketServiceTypes" ADD CONSTRAINT "ticketServiceTypes_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "serviceTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
