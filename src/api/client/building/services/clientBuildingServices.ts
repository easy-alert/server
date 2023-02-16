import { prisma } from '../../../../../prisma';
import { removeTimeDate } from '../../../../utils/dateTime';
import { getDateInfos } from '../../../../utils/dateTime/getDateInfos';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class ClientBuildingServices {
  separePerMonth({ data }: { data: any }) {
    const months: any = [
      {
        name: 'Janeiro',
        dates: [],
      },
      {
        name: 'Fevereiro',
        dates: [],
      },
      {
        name: 'Março',
        dates: [],
      },
      {
        name: 'Abril',
        dates: [],
      },
      {
        name: 'Maio',
        dates: [],
      },
      {
        name: 'Junho',
        dates: [],
      },
      {
        name: 'Julho',
        dates: [],
      },
      {
        name: 'Agosto',
        dates: [],
      },
      {
        name: 'Setembro',
        dates: [],
      },
      {
        name: 'Outubro',
        dates: [],
      },
      {
        name: 'Novembro',
        dates: [],
      },
      {
        name: 'Dezembro',
        dates: [],
      },
    ];

    data.forEach((maintenance: any) => {
      let maintenanceDate = null;

      if (maintenance.resolutionDate) maintenanceDate = maintenance.resolutionDate;
      else maintenanceDate = maintenance.notificationDate;

      const dateInfos = getDateInfos(maintenanceDate);
      switch (maintenanceDate.getMonth()) {
        case 0:
          months[0].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;

        case 1:
          months[1].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 2:
          months[2].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 3:
          months[3].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 4:
          months[4].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 5:
          months[5].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 6:
          months[6].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 7:
          months[7].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 8:
          months[8].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 9:
          months[9].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 10:
          months[10].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 11:
          months[11].dates.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;

        default:
          break;
      }
    });

    return months;
  }

  syndicSeparePerMonth({ data }: { data: any }) {
    const kanban: any = [
      {
        status: 'Pendentes',
        maintenances: [],
      },
      {
        status: 'Vencidas',
        label: 'Vencidas',
        maintenances: [],
      },
      {
        status: 'Concluídas',
        maintenances: [],
      },
    ];

    data.forEach((maintenance: any) => {
      let maintenanceDate = null;

      if (maintenance.resolutionDate) {
        maintenanceDate = {
          date: maintenance.resolutionDate,
          label: '',
        };

        if (maintenance.resolutionDate > maintenance.dueDate) {
          const lateDays =
            (maintenance.resolutionDate.getTime() - maintenance.dueDate.getTime()) /
            (1000 * 60 * 60 * 24);

          maintenanceDate = {
            date: maintenance.resolutionDate,
            label: `Feita com atraso de ${lateDays.toFixed()} ${lateDays > 1 ? 'dias' : 'dia'}`,
          };
        }
      } else {
        // PENDING

        const canView = removeTimeDate({
          date: maintenance.notificationDate,
          days:
            maintenance.Maintenance.period * maintenance.Maintenance.PeriodTimeInterval.unitTime,
        });

        if (canView < new Date()) {
          const missingDays =
            (maintenance.notificationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

          maintenanceDate = {
            date: maintenance.notificationDate,
            label: `Vence em ${missingDays.toFixed()} ${missingDays > 1 ? 'dias' : 'dia'}`,
          };
        }

        // EXPIRED
        if (maintenance.dueDate < new Date()) {
          const lateDays =
            (maintenance.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

          maintenanceDate = {
            date: maintenance.notificationDate,
            label: `Atrasado à ${Math.abs(lateDays).toFixed()} ${
              Math.abs(lateDays) > 1 ? 'dias' : 'dia'
            }`,
          };
        }
      }

      switch (maintenance.MaintenancesStatus.name) {
        case 'pending':
          kanban[0].maintenances.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            ...maintenanceDate,
          });
          break;

        case 'expired':
          kanban[1].maintenances.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            ...maintenanceDate,
          });
          break;
        case 'completed':
          kanban[2].maintenances.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            ...maintenanceDate,
          });
          break;
        case 'overdue':
          kanban[2].maintenances.push({
            id: maintenance.id,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            ...maintenanceDate,
          });
          break;

        default:
          break;
      }
    });

    return kanban;
  }

  async findMaintenanceHistory({
    buildingId,
    month,
    year,
    status,
  }: {
    buildingId: string;
    status: string | undefined;
    month: string | undefined;
    year: string;
  }) {
    const startDate = new Date(`${month ?? '01'}/01/${String(year)}`);
    const endDate = new Date(`${month ?? '12'}/31/${String(year)}`);

    const startDatePending = new Date(`01/01/${String(year)}`);
    const endDatePending = new Date(`12/31/${String(year)}`);

    let pendingStatus = 'pending';

    if (status !== undefined && status !== 'pending') pendingStatus = 'notFilter';

    const [Filters, MaintenancesHistory, MaintenancesPending] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,

          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          buildingId,
          MaintenancesStatus: {
            name: {
              in: status,
            },
          },
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  bannerName: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
                  type: true,
                },
              },
            },
          },
          Maintenance: {
            select: {
              id: true,
              element: true,
              frequency: true,
              activity: true,
              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },
            },
          },
          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          buildingId,
          MaintenancesStatus: {
            name: {
              in: status,
            },

            NOT: {
              name: 'pending',
            },
          },

          OR: [
            { notificationDate: { lte: endDate, gte: startDate } },
            { resolutionDate: { lte: endDate, gte: startDate } },
          ],
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  bannerName: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
                  type: true,
                },
              },
            },
          },
          Maintenance: {
            select: {
              id: true,
              element: true,
              frequency: true,
              activity: true,
              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },
            },
          },
          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          buildingId,
          MaintenancesStatus: {
            name: {
              in: pendingStatus,
            },

            NOT: [
              {
                name: 'expired',
              },
              {
                name: 'completed',
              },
              {
                name: 'overdue',
              },
            ],
          },

          OR: [
            { notificationDate: { lte: endDatePending, gte: startDatePending } },
            { resolutionDate: { lte: endDatePending, gte: startDatePending } },
          ],
        },
      }),
    ]);

    validator.needExist([
      {
        label: 'histórico de manutenção',
        variable: MaintenancesHistory,
      },
      {
        label: 'histórico de manutenção',
        variable: MaintenancesPending,
      },
    ]);

    return { Filters, MaintenancesHistory, MaintenancesPending };
  }

  async findSyndicMaintenanceHistory({
    buildingId,
    startDate,
    endDate,
    status,
  }: {
    buildingId: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    status: string | undefined;
  }) {
    const [MaintenancesHistory] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          dueDate: true,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  bannerName: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
                  type: true,
                },
              },
            },
          },
          Maintenance: {
            select: {
              id: true,
              element: true,
              frequency: true,
              activity: true,
              period: true,
              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },
              PeriodTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },
            },
          },
          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          buildingId,
          MaintenancesStatus: {
            name: {
              in: status,
            },
          },

          OR: [
            { notificationDate: { lte: endDate, gte: startDate } },
            { resolutionDate: { lte: endDate, gte: startDate } },
          ],
        },
      }),
    ]);

    validator.needExist([
      {
        label: 'histórico de manutenção',
        variable: MaintenancesHistory,
      },
    ]);

    return { MaintenancesHistory };
  }

  async findMainContactInformation({ buildingId }: { buildingId: string }) {
    const mainContact = await prisma.building.findFirst({
      select: {
        name: true,

        Annexes: {
          select: {
            name: true,
            url: true,
            originalName: true,
          },
        },

        NotificationsConfigurations: {
          select: {
            name: true,
            email: true,
            contactNumber: true,
            role: true,
          },
          where: {
            isMain: true,
          },
        },
      },
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'edificação', variable: mainContact }]);

    return mainContact;
  }
}
