-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_placeId_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "residentName" DROP NOT NULL,
ALTER COLUMN "residentApartment" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "placeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "ticketPlaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
