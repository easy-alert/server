-- CreateTable
CREATE TABLE "checklistReportPdfs" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorCompanyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "status" "ReportPDFStatusName" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklistReportPdfs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklistReportPdfs" ADD CONSTRAINT "checklistReportPdfs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklistReportPdfs" ADD CONSTRAINT "checklistReportPdfs_authorCompanyId_fkey" FOREIGN KEY ("authorCompanyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
