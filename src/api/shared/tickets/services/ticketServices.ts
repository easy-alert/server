import { TicketStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { removeDays, setToUTCMidnight } from '../../../../utils/dateTime';

const validator = new Validator();

interface IFindMany {
  page: number;
  take: number;
  buildingNanoId: string;
  initialCreatedAt?: Date;
  finalCreatedAt?: Date;
  statusName?: TicketStatusName;
}

class TicketServices {
  async create(args: prismaTypes.TicketCreateArgs) {
    return prisma.ticket.create(args);
  }

  async updateMany(args: prismaTypes.TicketUpdateManyArgs) {
    await prisma.ticket.updateMany(args);
  }

  async findById(id: string) {
    const data = await prisma.ticket.findUnique({
      include: {
        images: true,
        status: true,
        place: true,
        types: {
          select: {
            type: true,
          },
        },
        building: {
          select: {
            nanoId: true,
            id: true,
            name: true,
            Company: {
              select: {
                canAccessTickets: true,
              },
            },
          },
        },
      },
      where: { id },
    });

    validator.needExist([{ label: 'Ticket', variable: data }]);

    return data!;
  }

  async findMany({
    buildingNanoId,
    page,
    take,
    finalCreatedAt,
    initialCreatedAt,
    statusName,
  }: IFindMany) {
    const [tickets, ticketsCount, status] = await prisma.$transaction([
      prisma.ticket.findMany({
        include: {
          images: true,
          status: true,
          place: true,
          types: {
            select: {
              type: true,
            },
          },
        },

        take,
        skip: (page - 1) * take,

        where: {
          building: {
            nanoId: buildingNanoId,
          },

          createdAt: {
            gte: initialCreatedAt,
            lte: finalCreatedAt,
          },

          statusName,
        },

        orderBy: [{ status: { label: 'asc' } }, { createdAt: 'asc' }],
      }),
      prisma.ticket.count({
        where: {
          building: {
            nanoId: buildingNanoId,
          },

          createdAt: {
            gte: initialCreatedAt,
            lte: finalCreatedAt,
          },

          statusName,
        },
      }),
      prisma.ticketStatus.findMany({
        orderBy: {
          label: 'asc',
        },
      }),
    ]);

    return { tickets, ticketsCount, status };
  }

  async findAuxiliaryData() {
    const [places, types] = await prisma.$transaction([
      prisma.ticketPlace.findMany({
        orderBy: {
          label: 'asc',
        },
      }),
      prisma.serviceType.findMany({
        orderBy: {
          label: 'asc',
        },
      }),
    ]);

    return { places, types };
  }

  async checkAccess({ buildingNanoId }: { buildingNanoId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessTickets: true,
      },
      where: { Buildings: { some: { nanoId: buildingNanoId } } },
    });

    validator.needExist([{ label: 'Edificação', variable: company }]);

    if (!company?.canAccessTickets) {
      throw new ServerMessage({
        statusCode: 403,
        message: `Sua empresa não possui acesso a este módulo.`,
      });
    }
  }

  async countOpenTickets({ buildingId, ticketIds }: { buildingId: string; ticketIds: string[] }) {
    return prisma.ticket.count({
      where: {
        statusName: 'open',
        buildingId,
        id: { in: ticketIds },
      },
    });
  }

  async findExistingOccasionalMaintenances({ buildingNanoId }: { buildingNanoId: string }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        id: true,
        notificationDate: true,
        inProgress: true,

        MaintenancesStatus: {
          select: {
            name: true,
          },
        },
        Maintenance: {
          select: {
            element: true,
            activity: true,
          },
        },
      },
      where: {
        Maintenance: {
          MaintenanceType: {
            name: 'occasional',
          },
        },
        Building: {
          nanoId: buildingNanoId,
        },
        notificationDate: {
          gte: setToUTCMidnight(removeDays({ date: new Date(), days: 60 })),
        },
      },
      orderBy: {
        notificationDate: 'asc',
      },
    });
  }
}

export const ticketServices = new TicketServices();
