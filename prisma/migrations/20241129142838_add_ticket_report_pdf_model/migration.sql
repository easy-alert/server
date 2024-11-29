-- CreateEnum
CREATE TYPE "ReportPDFStatusName" AS ENUM ('pending', 'finished', 'failed');

-- CreateTable
CREATE TABLE "ticketReportPdfs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "authorId" TEXT NOT NULL,
    "authorCompanyId" TEXT NOT NULL,
    "status" "ReportPDFStatusName" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketReportPdfs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticketReportPdfs" ADD CONSTRAINT "ticketReportPdfs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketReportPdfs" ADD CONSTRAINT "ticketReportPdfs_authorCompanyId_fkey" FOREIGN KEY ("authorCompanyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
