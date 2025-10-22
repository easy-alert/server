import { Ticket, TicketStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { removeDays, setToUTCMidnight } from '../../../../utils/dateTime';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

const validator = new Validator();
const emailTransporter = new EmailTransporterServices();

interface IFindMany {
  buildingId: string[] | undefined;
  statusName?: TicketStatusName[];
  placeId?: string[];
  serviceTypeId?: string[];
  apartmentsNames?: string[];
  companyId: string | undefined;
  startDate?: Date;
  endDate?: Date;
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
            companyId: true,
            name: true,
            Company: {
              select: {
                canAccessTickets: true,
              },
            },
          },
        },
        checklistItems: true,
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
    buildingId,
    companyId,
    statusName,
    startDate,
    endDate,
    placeId,
    serviceTypeId,
    apartmentsNames,
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
          building: {
            select: {
              id: true,
              nanoId: true,
              name: true,
            },
          },
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

          types: serviceTypeId ? {
            some: {
              type: {
                id: {
                  in: serviceTypeId,
                },
              },
            },
          } : undefined,

          place: placeId ? {
            id: {
              in: placeId,
            },
          } : undefined,

          residentApartment: apartmentsNames ? {
            in: apartmentsNames,
          } : undefined,

          seen,

          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },

        orderBy: [{ createdAt: 'asc' }, { status: { label: 'asc' } }],
      }),

      prisma.ticket.findMany({
        select: {
          createdAt: true,
        },
        where: {
          building: {
            id: {
              in: buildingId,
            },
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

  async checkAccess({ buildingId }: { buildingId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessTickets: true,
      },
      where: { Buildings: { some: { id: buildingId } } },
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

  async sendCreatedTicketEmails({
    buildingId,
    ticketIds,
  }: {
    buildingId: string;
    ticketIds: string[];
  }) {
    const ticketsEmails = await prisma.ticket.findMany({
      select: {
        id: true,
        residentEmail: true,
        ticketNumber: true,
        residentName: true,

        building: {
          select: {
            name: true,

            UserBuildingsPermissions: {
              select: {
                User: {
                  select: {
                    name: true,
                    email: true,
                    emailIsConfirmed: true,
                  },
                },
              },

              where: {
                buildingId,

                User: {
                  Permissions: {
                    some: {
                      Permission: {
                        name: {
                          in: ['admin:company', 'access:tickets'],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      where: { id: { in: ticketIds } },
    });

    for (let index = 0; index < ticketsEmails.length; index++) {
      const { id, residentEmail, ticketNumber, residentName, building } = ticketsEmails[index];

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketCreated({
          toEmail: residentEmail,
          buildingName: building.name,
          residentName,
          ticketNumber,
          toWhom: 'resident',
          link: `${process.env.BASE_CLIENT_URL}/guest-ticket/${id}`,
        });

        await sleep(6000);
      }

      if (building.UserBuildingsPermissions.length) {
        building.UserBuildingsPermissions.forEach(async ({ User }) => {
          if (User.email && User.emailIsConfirmed) {
            emailTransporter.sendTicketCreated({
              toEmail: User.email,
              buildingName: building.name,
              responsibleName: User.name,
              ticketNumber,
              toWhom: 'responsible',
              link: `${process.env.BASE_COMPANY_URL}/tickets?ticketId=${id}`,
            });

            await sleep(6000);
          }
        });
      }
    }
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

  async sendDismissedTicketEmails({ ticketIds, userId }: { ticketIds: string[]; userId?: string }) {
    let userName = '';

    const emails = await prisma.ticket.findMany({
      select: {
        residentEmail: true,
        ticketNumber: true,
        residentName: true,
        dismissReasons: { select: { label: true } },
        dismissObservation: true,
        dismissedById: true,
      },
      where: { id: { in: ticketIds } },
    });

    const filteredEmails = emails.filter((e) => e.residentEmail);

    if (userId) {
      const userData = await prisma.buildingNotificationConfiguration.findUnique({
        select: {
          name: true,
        },

        where: {
          nanoId: userId,
        },
      });

      userName = userData?.name || '';
    }

    for (let index = 0; index < filteredEmails.length; index++) {
      const {
        residentEmail,
        ticketNumber,
        residentName,
        dismissReasons,
        dismissObservation,
        dismissedById,
      } = filteredEmails[index];

      const syndic = await prisma.buildingNotificationConfiguration.findUnique({
        select: {
          name: true,
        },
        where: {
          id: dismissedById || '',
        },
      });

      userName = syndic?.name || userName;

      // Teoricamente o filter ali de cima já era pra validar o email, mas não quer.
      if (residentEmail) {
        emailTransporter.sendTicketDismissed({
          toEmail: residentEmail,
          ticketNumber,
          residentName,
          dismissReason: dismissReasons?.label || '',
          dismissObservation: dismissObservation || '',
          dismissedBy: userName,
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
    const oldTicket = (await this.findById(ticketId)) as unknown as Ticket & {
      editedFields: string[];
      lastEditedAt?: Date;
    };

    const editableFields = [
      'residentName',
      'residentPhone',
      'residentApartment',
      'residentEmail',
      'residentCPF',
      'description',
    ];
    const editedFields: string[] = [];
    editableFields.forEach((field) => {
      if ((updatedTicket as any)[field] !== (oldTicket as any)[field]) {
        editedFields.push(field);
      }
    });

    const allEditedFields = Array.from(
      new Set([...(oldTicket.editedFields || []), ...editedFields]),
    );

    const now = new Date();

    const syndicData = await prisma.buildingNotificationConfiguration.findUnique({
      where: {
        nanoId: updatedTicket.dismissedById || '',
      },
    });

    const { editedFields: _remove, ...updatedTicketWithoutEditedFields } = updatedTicket as any;

    return prisma.ticket.update({
      data: {
        ...updatedTicketWithoutEditedFields,
        dismissedById: syndicData?.id,
        editedFields: { set: allEditedFields },
        lastEditedAt: editedFields.length > 0 ? now : oldTicket.lastEditedAt,
      },
      where: {
        id: ticketId,
      },
    });
  }

  async findManyTicketApartments({ buildingNanoId }: { buildingNanoId: string }) {
    const apartments = await prisma.building.findUnique({
      select: {
        BuildingApartments: {
          select: {
            id: true,
            number: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
      where: {
        nanoId: buildingNanoId,
      },
    });

    return apartments?.BuildingApartments;
  }

  async generateTicketNumber({ buildingId }: { buildingId: string }) {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      where: {
        buildingId,
      },

      take: 1,
    });

    return tickets.length ? tickets[0].ticketNumber + 1 : 1;
  }
}

export const ticketServices = new TicketServices();
