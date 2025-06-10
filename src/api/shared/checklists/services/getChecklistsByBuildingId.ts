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
      checklistItem: true,
      images: true,

      building: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    where: {
      buildingId: {
        in: buildingId,
      },

      building: {
        companyId,
      },

      checklistUsers: {
        some: {
          userId: {
            in: userId,
          },
        },
      },
    },
  });

  return checklists;
}
