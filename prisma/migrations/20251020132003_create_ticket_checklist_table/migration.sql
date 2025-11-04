-- CreateEnum
CREATE TYPE "TicketChecklistItemStatus" AS ENUM ('pending', 'completed');

-- CreateTable
CREATE TABLE "ticketChecklistItems" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "TicketChecklistItemStatus" NOT NULL DEFAULT 'pending',
    "position" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketChecklistItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticketChecklistItems_ticketId_idx" ON "ticketChecklistItems"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "ticketChecklistItems_ticketId_position_key" ON "ticketChecklistItems"("ticketId", "position");

-- AddForeignKey
ALTER TABLE "ticketChecklistItems" ADD CONSTRAINT "ticketChecklistItems_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketChecklistItems" ADD CONSTRAINT "ticketChecklistItems_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
