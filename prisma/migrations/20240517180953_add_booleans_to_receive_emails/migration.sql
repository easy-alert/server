-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "receiveDailyDueReports" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receivePreviousMonthReports" BOOLEAN NOT NULL DEFAULT false;
