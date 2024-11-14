-- CreateEnum
CREATE TYPE "TicketHistoryActivityType" AS ENUM ('comment', 'notification');

-- CreateTable
CREATE TABLE "ticketHistoryActivities" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "type" "TicketHistoryActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketHistoryActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketHistoryActivityImages" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketHistoryActivityImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticketHistoryActivities" ADD CONSTRAINT "ticketHistoryActivities_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketHistoryActivityImages" ADD CONSTRAINT "ticketHistoryActivityImages_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "ticketHistoryActivities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
