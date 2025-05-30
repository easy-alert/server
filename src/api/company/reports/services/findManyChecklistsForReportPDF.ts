import type { ChecklistStatusName } from '@prisma/client';
import { prisma } from '../../../../../prisma';

interface IFindManyChecklistsForReportPDF {
  companyId: string | undefined;
  buildingId: string[] | undefined;
  status?: ChecklistStatusName[];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  take?: number;
}

export async function findManyChecklistsForReportPDF({
  companyId,
  buildingId,
  status,
  startDate,
  endDate,
}: IFindManyChecklistsForReportPDF) {
  const [checklists, pendingChecklistsCount, inProgressChecklistsCount, completedChecklistCount] =
    await prisma.$transaction([
      prisma.checklist.findMany({
        include: {
          images: true,

          checklistItem: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              updatedAt: true,
            },
          },

          checklistUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },

          building: {
            select: {
              name: true,
            },
          },
        },

        where: {
          building: {
            id: {
              in: buildingId,
            },

            Company: {
              id: companyId,
            },
          },

          status: {
            in: status,
          },

          date: {
            gte: startDate,
            lte: endDate,
          },
        },

        orderBy: [{ date: 'asc' }, { status: 'asc' }],
      }),

      prisma.checklist.count({
        where: {
          building: {
            id: {
              in: buildingId,
            },

            Company: {
              id: companyId,
            },
          },

          status: 'pending',

          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      prisma.checklist.count({
        where: {
          building: {
            id: {
              in: buildingId,
            },

            Company: {
              id: companyId,
            },
          },

          status: 'inProgress',

          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      prisma.checklist.count({
        where: {
          building: {
            id: {
              in: buildingId,
            },

            Company: {
              id: companyId,
            },
          },

          status: 'completed',

          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

  return {
    checklists,
    pendingChecklistsCount,
    inProgressChecklistsCount,
    completedChecklistCount,
  };
}
