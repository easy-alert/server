-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "linkedExternalForPayment" TEXT[] DEFAULT ARRAY[]::TEXT[];
