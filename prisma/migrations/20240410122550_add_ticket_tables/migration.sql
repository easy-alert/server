-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "residentName" TEXT NOT NULL,
    "residentApartment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketImages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticketImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketPlaces" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ticketPlaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceTypes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "serviceTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketServiceTypes" (
    "ticketId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,

    CONSTRAINT "ticketServiceTypes_pkey" PRIMARY KEY ("ticketId","serviceTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticketPlaces_label_key" ON "ticketPlaces"("label");

-- CreateIndex
CREATE UNIQUE INDEX "serviceTypes_label_key" ON "serviceTypes"("label");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "ticketPlaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketImages" ADD CONSTRAINT "ticketImages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketServiceTypes" ADD CONSTRAINT "ticketServiceTypes_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketServiceTypes" ADD CONSTRAINT "ticketServiceTypes_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "serviceTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
