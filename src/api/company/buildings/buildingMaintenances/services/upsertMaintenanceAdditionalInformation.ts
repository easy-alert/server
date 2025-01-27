import { prisma } from '../../../../../../prisma';

export async function upsertMaintenanceAdditionalInformation({
  buildingId,
  maintenanceId,
  additionalInfo,
}: {
  buildingId: string;
  maintenanceId: string;
  additionalInfo: string;
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
    },
    create: {
      buildingId,
      maintenanceId,
      information: additionalInfo,
    },
  });
}
