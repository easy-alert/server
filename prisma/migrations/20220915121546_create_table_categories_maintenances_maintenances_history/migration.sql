-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancesHistory" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "responsible" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "delay" INTEGER NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_key" ON "categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenances_id_key" ON "maintenances"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesHistory_id_key" ON "maintenancesHistory"("id");

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
