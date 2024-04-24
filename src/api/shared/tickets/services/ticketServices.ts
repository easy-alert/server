import { TicketStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { removeDays, setToUTCMidnight } from '../../../../utils/dateTime';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

const validator = new Validator();
const emailTransporter = new EmailTransporterServices();

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

  async delete(id: string) {
    await this.findById(id);

    await prisma.ticket.delete({ where: { id } });
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

    validator.needExist([{ label: 'Empresa', variable: company }]);

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

  async sendFinishedTicketEmails({ ticketIds }: { ticketIds: string[] }) {
    const emails = await prisma.ticket.findMany({
      select: { residentEmail: true, ticketNumber: true, residentName: true },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

    async function sleep(ms: number) {
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (let index = 0; index < filteredEmails.length; index++) {
      const { residentEmail, ticketNumber, residentName } = filteredEmails[index];

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketFinished({
          residentName,
          ticketNumber,
          toEmail: residentEmail,
        });

        await sleep(6000);
      }
    }
  }
}

export const ticketServices = new TicketServices();
