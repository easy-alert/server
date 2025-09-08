-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "editedFields" TEXT[] DEFAULT ARRAY[]::TEXT[];
