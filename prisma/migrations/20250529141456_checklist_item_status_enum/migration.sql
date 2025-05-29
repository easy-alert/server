/*
  Warnings:

  - The `status` column on the `checklistItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ChecklistItemStatusName" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "checklistItems" DROP COLUMN "status",
ADD COLUMN     "status" "ChecklistItemStatusName" NOT NULL DEFAULT 'pending';
