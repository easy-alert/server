-- CreateEnum
CREATE TYPE "StockHistoryActivityType" AS ENUM ('comment', 'notification');

-- CreateTable
CREATE TABLE "stockHistoryActivities" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "type" "StockHistoryActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockHistoryActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stockHistoryActivityImages" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stockHistoryActivityImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stockHistoryActivities_stockId_idx" ON "stockHistoryActivities"("stockId");

-- CreateIndex
CREATE INDEX "stockHistoryActivityImages_activityId_idx" ON "stockHistoryActivityImages"("activityId");

-- AddForeignKey
ALTER TABLE "stockHistoryActivities" ADD CONSTRAINT "stockHistoryActivities_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockHistoryActivityImages" ADD CONSTRAINT "stockHistoryActivityImages_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "stockHistoryActivities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
