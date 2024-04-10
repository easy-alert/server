import { TicketStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

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
    const [tickets, status] = await prisma.$transaction([
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

        orderBy: [{ statusName: 'asc' }, { createdAt: 'asc' }],
      }),
      prisma.ticketStatus.findMany({
        orderBy: {
          label: 'asc',
        },
      }),
    ]);

    return { tickets, status };
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
}

export const ticketServices = new TicketServices();
