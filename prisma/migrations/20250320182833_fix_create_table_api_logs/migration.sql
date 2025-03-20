/*
  Warnings:

  - You are about to drop the `api_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "api_logs";

-- CreateTable
CREATE TABLE "apiLogs" (
    "id" TEXT NOT NULL,
    "body" TEXT,
    "path" TEXT,
    "query" TEXT,
    "params" TEXT,
    "method" TEXT,
    "companyId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apiLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apiLogs_id_key" ON "apiLogs"("id");

-- AddForeignKey
ALTER TABLE "apiLogs" ADD CONSTRAINT "apiLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apiLogs" ADD CONSTRAINT "apiLogs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
