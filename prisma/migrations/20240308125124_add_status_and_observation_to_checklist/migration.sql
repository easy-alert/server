/*
  Warnings:

  - Added the required column `status` to the `checklists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChecklistStatusName" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "checklists" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "status" "ChecklistStatusName" NOT NULL;

-- CreateTable
CREATE TABLE "checklistImages" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "checklistImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklistImages" ADD CONSTRAINT "checklistImages_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
