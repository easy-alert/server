-- CreateEnum
CREATE TYPE "TicketFieldVisibility" AS ENUM ('hidden', 'visible', 'required');

-- CreateTable
CREATE TABLE "ticketFieldsConfig" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "residentName" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "residentPhone" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "residentApartment" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "residentEmail" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "residentCPF" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "description" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "placeId" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "types" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "attachments" "TicketFieldVisibility" NOT NULL DEFAULT 'visible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketFieldsConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticketFieldsConfig_companyId_idx" ON "ticketFieldsConfig"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ticketFieldsConfig_companyId_key" ON "ticketFieldsConfig"("companyId");

-- AddForeignKey
ALTER TABLE "ticketFieldsConfig" ADD CONSTRAINT "ticketFieldsConfig_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
