-- CreateTable
CREATE TABLE "buildingsAccessHistory" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsAccessHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingsAccessHistory_id_key" ON "buildingsAccessHistory"("id");

-- AddForeignKey
ALTER TABLE "buildingsAccessHistory" ADD CONSTRAINT "buildingsAccessHistory_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
