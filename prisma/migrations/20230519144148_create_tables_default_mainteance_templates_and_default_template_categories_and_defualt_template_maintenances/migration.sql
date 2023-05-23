-- CreateTable
CREATE TABLE "defaultMaintenanceTemplates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defaultMaintenanceTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defaultTemplateCategories" (
    "id" TEXT NOT NULL,
    "defaultMaintenanceTemplateId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defaultTemplateCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defaultTemplateMaintenances" (
    "id" TEXT NOT NULL,
    "defaultTemplateCategoryId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "defaultTemplateMaintenances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "defaultMaintenanceTemplates_id_key" ON "defaultMaintenanceTemplates"("id");

-- CreateIndex
CREATE UNIQUE INDEX "defaultTemplateCategories_id_key" ON "defaultTemplateCategories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "defaultTemplateMaintenances_id_key" ON "defaultTemplateMaintenances"("id");

-- AddForeignKey
ALTER TABLE "defaultTemplateCategories" ADD CONSTRAINT "defaultTemplateCategories_defaultMaintenanceTemplateId_fkey" FOREIGN KEY ("defaultMaintenanceTemplateId") REFERENCES "defaultMaintenanceTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defaultTemplateCategories" ADD CONSTRAINT "defaultTemplateCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defaultTemplateMaintenances" ADD CONSTRAINT "defaultTemplateMaintenances_defaultTemplateCategoryId_fkey" FOREIGN KEY ("defaultTemplateCategoryId") REFERENCES "defaultTemplateCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defaultTemplateMaintenances" ADD CONSTRAINT "defaultTemplateMaintenances_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
