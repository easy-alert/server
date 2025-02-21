import { prisma } from '../../../../../prisma';

interface IGetChecklistsByBuildingId {
  companyId: string;
  buildingId: string[] | undefined;
  userId?: string[] | undefined;
}

export async function getChecklistsByBuildingId({
  companyId,
  buildingId,
  userId,
}: IGetChecklistsByBuildingId) {
  const checklists = await prisma.checklist.findMany({
    include: {
      user: true,

      building: {
        select: {
          id: true,
          name: true,
        },
      },

      checklistItem: true,
      images: true,
    },

    where: {
      buildingId: {
        in: buildingId,
      },

      building: {
        companyId,
      },

      userId: {
        in: userId,
      },
    },
  });

  return checklists;
}
