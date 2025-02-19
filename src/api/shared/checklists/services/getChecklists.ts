import { prisma } from '../../../../../prisma';

interface IGetChecklists {
  buildingId?: string;
  checklistId?: string;
}

export async function getChecklists({ buildingId, checklistId }: IGetChecklists) {
  let building = null;

  if (buildingId && buildingId?.length === 12) {
    building = await prisma.building.findUnique({
      where: {
        nanoId: buildingId,
      },
    });
  } else if (buildingId) {
    building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });
  }

  const checklistTemplates = await prisma.checklist.findMany({
    include: {
      checklistItem: true,
      user: true,
      images: true,
    },

    where: {
      id: checklistId,
      buildingId: building?.id ?? undefined,
      checklistItem: {
        some: {
          checklistId,
        },
      },
    },
  });

  return checklistTemplates;
}
