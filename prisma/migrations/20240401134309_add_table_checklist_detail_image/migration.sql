-- CreateTable
CREATE TABLE "checklistDetailImages" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "checklistDetailImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklistDetailImages" ADD CONSTRAINT "checklistDetailImages_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
