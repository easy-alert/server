import { prisma } from '../../../../../prisma';

interface IGetChecklists {
  companyId?: string;
  checklistId: string;
}

export async function getChecklists({ companyId, checklistId }: IGetChecklists) {
  const checklist = await prisma.checklist.findMany({
    include: {
      checklistItem: true,
      images: true,

      building: {
        select: {
          id: true,
          name: true,
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },

    where: {
      id: checklistId,

      building: {
        companyId,
      },
    },
  });

  return checklist;
}
