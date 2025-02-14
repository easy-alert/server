import { prisma } from '../../../../../../prisma';

export async function upsertMaintenanceAdditionalInformation({
  buildingId,
  maintenanceId,
  additionalInfo,
  userResponsibleId,
}: {
  buildingId: string;
  maintenanceId: string;
  additionalInfo: string;
  userResponsibleId: string;
}) {
  return prisma.maintenanceAdditionalInformation.upsert({
    where: {
      buildingId_maintenanceId: {
        buildingId,
        maintenanceId,
      },
    },
    update: {
      information: additionalInfo,
      userId: userResponsibleId,
    },
    create: {
      buildingId,
      maintenanceId,
      information: additionalInfo,
      userId: userResponsibleId,
    },
  });
}
