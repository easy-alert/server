import { Ticket, TicketStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { removeDays, setToUTCMidnight } from '../../../../utils/dateTime';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

const validator = new Validator();
const emailTransporter = new EmailTransporterServices();

interface IFindMany {
  buildingNanoId: string | undefined;
  companyId: string | undefined;
  statusName?: string;
  startDate?: Date;
  endDate?: Date;
  placeId?: string;
  serviceTypeId?: string;
  seen?: boolean;
  page?: number;
  take?: number;
}

interface IFindManyForReport {
  companyId: string;
  buildingNames?: string[];
  statusNames?: TicketStatusName[];
  startDate: Date;
  endDate: Date;
}

interface IUpdateOneTicketInput {
  ticketId: string;
  updatedTicket: Ticket;
}

async function sleep(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
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
        dismissReasons: true,
        dismissedBy: {
          select: {
            name: true,
          },
        },
        types: {
          select: {
            type: true,
          },
          orderBy: {
            type: { singularLabel: 'asc' },
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
    companyId,
    statusName,
    startDate,
    endDate,
    placeId,
    serviceTypeId,
    seen,
  }: IFindMany) {
    const [tickets, ticketsByYear] = await prisma.$transaction([
      prisma.ticket.findMany({
        select: {
          id: true,
          status: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          ticketNumber: true,
          residentName: true,
          seen: true,
          place: {
            select: {
              label: true,
            },
          },
          types: {
            select: {
              type: true,
            },
          },
        },

        where: {
          building: {
            nanoId: buildingNanoId,
            companyId,
          },

          status: {
            label: statusName,
          },

          types: {
            some: {
              type: {
                id: serviceTypeId,
              },
            },
          },

          place: {
            id: placeId,
          },

          seen,

          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },

        orderBy: [{ status: { label: 'asc' } }, { createdAt: 'asc' }],
      }),

      prisma.ticket.findMany({
        select: {
          createdAt: true,
        },
        where: {
          building: {
            nanoId: buildingNanoId,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    const formattedYears = [
      ...new Set(ticketsByYear.map((ticket) => ticket.createdAt.getFullYear().toString())),
    ];

    return { tickets, years: formattedYears };
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
          singularLabel: 'asc',
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

  async checkAccessByCompany({ companyId }: { companyId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessTickets: true,
      },
      where: {
        id: companyId,
      },
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

  async sendCreatedTicketEmails({ ticketIds }: { ticketIds: string[] }) {
    const emails = await prisma.ticket.findMany({
      select: {
        residentEmail: true,
        ticketNumber: true,
        residentName: true,
        building: { select: { name: true, NotificationsConfigurations: true } },
      },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

    for (let index = 0; index < filteredEmails.length; index++) {
      const { residentEmail, ticketNumber, residentName, building } = filteredEmails[index];

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketCreated({
          toEmail: residentEmail,
          buildingName: building.name,
          residentName,
          ticketNumber,
          toWhom: 'resident',
        });

        await sleep(6000);
      }
    }

    emails.forEach(async (email) => {
      email.building.NotificationsConfigurations.forEach(async (config) => {
        if (config.email && config.emailIsConfirmed) {
          emailTransporter.sendTicketCreated({
            toEmail: config.email,
            buildingName: email.building.name,
            responsibleName: config.name,
            ticketNumber: email.ticketNumber,
            toWhom: 'responsible',
          });

          await sleep(6000);
        }
      });
    });
  }

  async sendStatusChangedEmails({ ticketIds }: { ticketIds: string[] }) {
    const emails = await prisma.ticket.findMany({
      select: {
        residentEmail: true,
        ticketNumber: true,
        residentName: true,
        status: {
          select: {
            label: true,
          },
        },
        building: { select: { name: true } },
      },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

    for (let index = 0; index < filteredEmails.length; index++) {
      const { residentEmail, ticketNumber, residentName, status, building } = filteredEmails[index];

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketStatusChanged({
          toEmail: residentEmail,
          residentName,
          ticketNumber,
          buildingName: building.name,
          statusName: status.label,
        });

        await sleep(6000);
      }
    }
  }

  async sendFinishedTicketEmails({ ticketIds }: { ticketIds: string[] }) {
    const emails = await prisma.ticket.findMany({
      select: { residentEmail: true, ticketNumber: true, residentName: true },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

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

  async sendDismissedTicketEmails({ ticketIds }: { ticketIds: string[] }) {
    const emails = await prisma.ticket.findMany({
      select: {
        residentEmail: true,
        ticketNumber: true,
        residentName: true,
        dismissReasons: { select: { label: true } },
        dismissObservation: true,
        dismissedBy: true,
      },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

    for (let index = 0; index < filteredEmails.length; index++) {
      const {
        residentEmail,
        ticketNumber,
        residentName,
        dismissReasons,
        dismissObservation,
        // dismissedBy,
      } = filteredEmails[index];

      const syndic = await prisma.buildingNotificationConfiguration.findUnique({
        select: {
          name: true,
        },
        where: {
          id: '',
        },
      });

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketDismissed({
          toEmail: residentEmail,
          ticketNumber,
          residentName,
          dismissReason: dismissReasons?.label || '',
          dismissObservation: dismissObservation || '',
          dismissedBy: syndic?.name || '',
        });

        await sleep(6000);
      }
    }
  }

  async findManyForReport({
    companyId,
    endDate,
    startDate,
    buildingNames,
    statusNames,
  }: IFindManyForReport) {
    const where: prismaTypes.TicketWhereInput = {
      building: {
        companyId,
        name: buildingNames?.length ? { in: buildingNames } : undefined,
      },

      createdAt: {
        gte: startDate,
        lte: endDate,
      },

      statusName: statusNames?.length ? { in: statusNames } : undefined,
    };

    return prisma.ticket.findMany({
      select: {
        id: true,
        building: {
          select: {
            name: true,
          },
        },
        description: true,
        images: {
          select: {
            name: true,
            url: true,
          },
          where: {
            OR: [
              { url: { endsWith: '.png' } },
              { url: { endsWith: '.jpg' } },
              { url: { endsWith: '.jpeg' } },
            ],
          },
        },
        place: {
          select: {
            label: true,
          },
        },
        types: {
          select: {
            type: {
              select: {
                singularLabel: true,
              },
            },
          },
          orderBy: {
            type: { singularLabel: 'asc' },
          },
        },
        status: true,
        createdAt: true,
        residentName: true,
        residentApartment: true,
      },
      where,

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateOneTicket({ ticketId, updatedTicket }: IUpdateOneTicketInput) {
    const syndicData = await prisma.buildingNotificationConfiguration.findUnique({
      where: {
        nanoId: updatedTicket.dismissedById || '',
      },
    });

    await prisma.ticket.update({
      data: {
        ...updatedTicket,
        dismissedById: syndicData?.id,
      },

      where: {
        id: ticketId,
      },
    });
  }
}

export const ticketServices = new TicketServices();
