/*
  Warnings:

  - Added the required column `statusName` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatusName" AS ENUM ('open', 'finished', 'awaitingToFinish');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "statusName" "TicketStatusName" NOT NULL;

-- CreateTable
CREATE TABLE "ticketStatus" (
    "name" "TicketStatusName" NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "ticketStatus_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticketStatus_label_key" ON "ticketStatus"("label");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_statusName_fkey" FOREIGN KEY ("statusName") REFERENCES "ticketStatus"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
