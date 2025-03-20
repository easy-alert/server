-- CreateTable
CREATE TABLE "api_logs" (
    "id" TEXT NOT NULL,
    "body" TEXT,
    "path" TEXT,
    "query" TEXT,
    "params" TEXT,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_logs_id_key" ON "api_logs"("id");
