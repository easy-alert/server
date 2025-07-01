/*
  Warnings:

  - You are about to drop the `tutorials` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlatformVideoType" AS ENUM ('tutorial', 'news', 'feature');

-- CreateEnum
CREATE TYPE "PlatformVideoStatus" AS ENUM ('draft', 'published', 'archived');

-- DropTable
DROP TABLE "tutorials";

-- CreateTable
CREATE TABLE "platformVideos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "youtubeId" TEXT,
    "thumbnail" TEXT,
    "order" INTEGER,
    "type" "PlatformVideoType" NOT NULL DEFAULT 'tutorial',
    "status" "PlatformVideoStatus" NOT NULL DEFAULT 'draft',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platformVideos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platformVideos_youtubeId_key" ON "platformVideos"("youtubeId");
