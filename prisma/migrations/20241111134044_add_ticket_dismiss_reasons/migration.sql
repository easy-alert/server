-- CreateEnum
CREATE TYPE "TicketDismissReasonsName" AS ENUM ('outOfWarranty', 'outOfResponsibility', 'lackOfInformation', 'lackOfResources', 'lackOfApproval', 'other');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "dismissReasonName" "TicketDismissReasonsName";

-- CreateTable
CREATE TABLE "ticketDismissReasons" (
    "name" "TicketDismissReasonsName" NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketDismissReasons_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticketDismissReasons_label_key" ON "ticketDismissReasons"("label");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_dismissReasonName_fkey" FOREIGN KEY ("dismissReasonName") REFERENCES "ticketDismissReasons"("name") ON DELETE SET NULL ON UPDATE CASCADE;
