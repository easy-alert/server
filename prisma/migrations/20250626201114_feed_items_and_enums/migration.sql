-- CreateEnum
CREATE TYPE "FeedItemType" AS ENUM ('alert', 'announcement', 'promotion');

-- CreateTable
CREATE TABLE "feedItems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ctaLink" TEXT,
    "ctaText" TEXT,
    "type" "FeedItemType" NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedItems_pkey" PRIMARY KEY ("id")
);
