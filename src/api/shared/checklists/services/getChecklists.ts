import { prisma } from '../../../../../prisma';

interface IGetChecklists {
  companyId?: string;
  checklistId: string;
}

export async function getChecklists({ companyId, checklistId }: IGetChecklists) {
  const checklist = await prisma.checklist.findMany({
    include: {
      images: true,
      checklistItem: true,

      building: {
        select: {
          id: true,
          name: true,
        },
      },

      checklistUsers: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },

      finishedBy: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          phoneNumber: true,
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
