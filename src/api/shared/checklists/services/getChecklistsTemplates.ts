import { prisma } from '../../../../../prisma';

interface IGetChecklistsTemplates {
  buildingId: string;
}

export async function getChecklistsTemplates({ buildingId }: IGetChecklistsTemplates) {
  let building = null;

  if (buildingId.length === 12) {
    building = await prisma.building.findUnique({
      where: {
        nanoId: buildingId,
      },
    });
  } else {
    building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });
  }

  if (!building) {
    throw new Error('Edificação não encontrada.');
  }

  const checklistTemplates = await prisma.checklistTemplate.findMany({
    include: {
      items: true,
    },

    where: {
      buildingId: building.id,
    },
  });

  return checklistTemplates;
}
