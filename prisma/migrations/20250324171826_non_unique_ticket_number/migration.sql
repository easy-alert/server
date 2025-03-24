-- DropIndex
DROP INDEX "tickets_ticketNumber_key";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "ticketNumber" DROP DEFAULT;
DROP SEQUENCE "tickets_ticketNumber_seq";
