import type { TicketStatusName } from '@prisma/client';
import { prisma } from '../../../../../prisma';

interface IFindManyTicketsForReportPDF {
  buildingId: string[] | undefined;
  statusName?: TicketStatusName[];
  placeId?: string[];
  serviceTypeId?: string[];
  companyId: string | undefined;
  startDate?: Date;
  endDate?: Date;
  seen?: boolean;
  page?: number;
  take?: number;
}

export async function findManyTicketsForReportPDF({
  buildingId,
  companyId,
  statusName,
  placeId,
  serviceTypeId,
  startDate,
  endDate,
  seen,
}: IFindManyTicketsForReportPDF) {
  const [
    tickets,
    ticketsStatus,
    openTicketsCount,
    awaitingToFinishTicketsCount,
    finishedTicketsCount,
    dismissedTicketsCount,
  ] = await prisma.$transaction([
    prisma.ticket.findMany({
      include: {
        images: true,
        types: {
          select: {
            type: {
              select: {
                label: true,
                color: true,
                backgroundColor: true,
              },
            },
          },
        },
        place: true,
        status: true,
        activities: true,
        building: {
          select: {
            name: true,
          },
        },
      },

      where: {
        building: {
          companyId,
          id: {
            in: buildingId,
          },
        },

        status: {
          name: {
            in: statusName,
          },
        },

        types: {
          some: {
            type: {
              id: {
                in: serviceTypeId,
              },
            },
          },
        },

        place: {
          id: {
            in: placeId,
          },
        },

        seen,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      orderBy: [{ createdAt: 'asc' }, { status: { label: 'asc' } }],
    }),

    prisma.ticketStatus.findMany(),

    prisma.ticket.count({
      where: {
        building: {
          companyId,
          id: {
            in: buildingId,
          },
        },

        status: {
          name: 'open',
        },

        types: {
          some: {
            type: {
              id: {
                in: serviceTypeId,
              },
            },
          },
        },

        place: {
          id: {
            in: placeId,
          },
        },

        seen,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    prisma.ticket.count({
      where: {
        building: {
          companyId,
          id: {
            in: buildingId,
          },
        },

        status: {
          name: 'awaitingToFinish',
        },

        types: {
          some: {
            type: {
              id: {
                in: serviceTypeId,
              },
            },
          },
        },

        place: {
          id: {
            in: placeId,
          },
        },

        seen,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    prisma.ticket.count({
      where: {
        building: {
          companyId,
          id: {
            in: buildingId,
          },
        },

        status: {
          name: 'finished',
        },

        types: {
          some: {
            type: {
              id: {
                in: serviceTypeId,
              },
            },
          },
        },

        place: {
          id: {
            in: placeId,
          },
        },

        seen,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),

    prisma.ticket.count({
      where: {
        building: {
          companyId,
          id: {
            in: buildingId,
          },
        },

        status: {
          name: 'dismissed',
        },

        types: {
          some: {
            type: {
              id: {
                in: serviceTypeId,
              },
            },
          },
        },

        place: {
          id: {
            in: placeId,
          },
        },

        seen,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  return {
    tickets,
    ticketsStatus,
    openTicketsCount,
    awaitingToFinishTicketsCount,
    finishedTicketsCount,
    dismissedTicketsCount,
  };
}
