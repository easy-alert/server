-- AlterEnum
ALTER TYPE "ChecklistStatusName" ADD VALUE 'inProgress';

-- AlterTable
ALTER TABLE "checklists" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "checklistItems" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ChecklistStatusName" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklistItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklistTemplates" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklistTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklistTemplateItems" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklistTemplateItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklistTemplates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklistItems" ADD CONSTRAINT "checklistItems_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklistTemplates" ADD CONSTRAINT "checklistTemplates_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklistTemplateItems" ADD CONSTRAINT "checklistTemplateItems_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklistTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
