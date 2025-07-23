import type { MaintenancePriorityName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

import { SharedMaintenanceServices } from '../../../shared/maintenance/services/sharedMaintenanceServices';

import { removeDays } from '../../../../utils/dateTime';
import { getDateInfos } from '../../../../utils/dateTime/getDateInfos';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();
const sharedMaintenanceServices = new SharedMaintenanceServices();

export class ClientBuildingServices {
  separePerMonth({ data }: { data: any }) {
    const months: any = [
      {
        name: 'Janeiro',
        monthNumber: '01',
        dates: [],
      },
      {
        name: 'Fevereiro',
        monthNumber: '02',
        dates: [],
      },
      {
        name: 'Março',
        monthNumber: '03',
        dates: [],
      },
      {
        name: 'Abril',
        monthNumber: '04',
        dates: [],
      },
      {
        name: 'Maio',
        monthNumber: '05',
        dates: [],
      },
      {
        name: 'Junho',
        monthNumber: '06',
        dates: [],
      },
      {
        name: 'Julho',
        monthNumber: '07',
        dates: [],
      },
      {
        name: 'Agosto',
        monthNumber: '08',
        dates: [],
      },
      {
        name: 'Setembro',
        monthNumber: '09',
        dates: [],
      },
      {
        name: 'Outubro',
        monthNumber: '10',
        dates: [],
      },
      {
        name: 'Novembro',
        monthNumber: '11',
        dates: [],
      },
      {
        name: 'Dezembro',
        monthNumber: '12',
        dates: [],
      },
    ];

    data.forEach((maintenance: any) => {
      let maintenanceDate = null;

      if (maintenance.resolutionDate)
        maintenanceDate = maintenance.resolutionDate || maintenance.createdAt;
      else maintenanceDate = maintenance.notificationDate || maintenance.createdAt;

      const dateInfos = getDateInfos(maintenanceDate);

      let formattedMaintenance = {};

      if (Object.keys(maintenance).includes('ticketNumber')) {
        let maintenanceTypes = '';

        maintenance.types.forEach((activityType: any, i: number) => {
          if (i !== 0)
            maintenanceTypes = `${maintenanceTypes}, ${activityType.type.label.toLowerCase()}`;
          else maintenanceTypes = activityType.type.label;
        });

        formattedMaintenance = {
          id: maintenance.id,
          element: `${maintenance.residentName} - ${maintenance.residentApartment}`,
          activity: maintenanceTypes,
          status: maintenance.status.name,
          statusLabel: maintenance.status.label,
          statusColor: maintenance.status.color,
          statusBgColor: maintenance.status.backgroundColor,
          isFuture: false,
          expectedNotificationDate: '',
          expectedDueDate: '',
          dateInfos,
          type: 'ticket',
          inProgress: maintenance.status.name === 'awaitingToFinish',
        };
      } else {
        formattedMaintenance = {
          id: maintenance.id,
          element: maintenance.Maintenance.element,
          activity: maintenance.Maintenance.activity,
          status: maintenance.MaintenancesStatus.name,
          isFuture: maintenance.isFuture ?? false,
          expectedNotificationDate: maintenance.expectedNotificationDate,
          expectedDueDate: maintenance.expectedDueDate,
          dateInfos,
          type: maintenance.type ?? null,
          inProgress: maintenance.inProgress ?? false,
          categoryId: maintenance.Maintenance.Category.id ?? null,
        };
      }

      switch (maintenanceDate.getMonth()) {
        case 0:
          months[0].dates.push(formattedMaintenance);
          break;
        case 1:
          months[1].dates.push(formattedMaintenance);
          break;
        case 2:
          months[2].dates.push(formattedMaintenance);
          break;
        case 3:
          months[3].dates.push(formattedMaintenance);
          break;
        case 4:
          months[4].dates.push(formattedMaintenance);
          break;
        case 5:
          months[5].dates.push(formattedMaintenance);
          break;
        case 6:
          months[6].dates.push(formattedMaintenance);
          break;
        case 7:
          months[7].dates.push(formattedMaintenance);
          break;
        case 8:
          months[8].dates.push(formattedMaintenance);
          break;
        case 9:
          months[9].dates.push(formattedMaintenance);
          break;
        case 10:
          months[10].dates.push(formattedMaintenance);
          break;
        case 11:
          months[11].dates.push(formattedMaintenance);
          break;

        default:
          break;
      }
    });

    return months;
  }

  async syndicSeparePerStatus({ data }: { data: any }) {
    const today = changeTime({
      date: new Date(),
      time: {
        h: 0,
        m: 0,
        ms: 0,
        s: 0,
      },
    });

    const kanban: any = [
      {
        // SE ALTERAR A ORDEM DISSO, ALTERAR NO SCRIPT DE DELETAR AS EXPIRADAS
        status: 'Vencidas',
        maintenances: [],
      },
      {
        status: 'Pendentes',
        maintenances: [],
      },
      {
        status: 'Em execução',
        maintenances: [],
      },
      {
        status: 'Concluídas',
        maintenances: [],
      },
    ];

    for (let i = 0; i < data.length; i++) {
      const maintenance = data[i];

      let auxiliaryData = null;
      let period = null;
      let canReportDate = null;

      switch (maintenance.MaintenancesStatus.name) {
        case 'pending': {
          // ARRAY ORDENADO POR DATA DE CRIAÇÃO, LOGO SE TIVER UMA PENDENTE, ELA SERÁ A PRIMEIRA POSIÇÃO
          const history = await sharedMaintenanceServices.findHistoryByBuildingId({
            buildingId: maintenance.Building.id,
            maintenanceId: maintenance.Maintenance.id,
          });

          period =
            maintenance.Maintenance.period * maintenance.Maintenance.PeriodTimeInterval.unitTime;

          if (maintenance.daysInAdvance) {
            canReportDate = maintenance.notificationDate;
          } else {
            canReportDate = removeDays({
              date: maintenance.notificationDate,
              days: period,
            });
          }

          if (
            (today >= canReportDate && history[1]?.MaintenancesStatus?.name !== 'expired') ||
            today >= history[0]?.notificationDate
          ) {
            auxiliaryData = Math.floor(
              (maintenance.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );

            let label = '';

            if (auxiliaryData === 0) {
              label = 'Vence hoje';
            }

            if (
              auxiliaryData >= 1 &&
              maintenance.Maintenance.MaintenanceType.name !== 'occasional'
            ) {
              label = `Vence em ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`;
            }

            kanban[maintenance.inProgress ? 2 : 1].maintenances.push({
              id: maintenance.id,
              buildingName: maintenance.Building.name,
              element: maintenance.Maintenance.element,
              activity: maintenance.Maintenance.activity,
              status: maintenance.MaintenancesStatus.name,
              priorityLabel: maintenance.priority?.label,
              priorityColor: maintenance.priority?.color,
              priorityBackgroundColor: maintenance.priority?.backgroundColor,
              serviceOrderNumber: maintenance.serviceOrderNumber,

              // para ordenação
              date: maintenance.notificationDate,
              dueDate: maintenance.dueDate,
              label,
              type: maintenance.Maintenance.MaintenanceType.name,
              inProgress: maintenance.inProgress,
            });
          }

          break;
        }

        case 'expired': {
          // ARRAY ORDENADO POR DATA DE CRIAÇÃO, LOGO SE TIVER UMA PENDENTE, ELA SERÁ A PRIMEIRA POSIÇÃO
          const history = await sharedMaintenanceServices.findHistoryByBuildingId({
            buildingId: maintenance.Building.id,
            maintenanceId: maintenance.Maintenance.id,
          });

          const historyPeriod =
            history[0].Maintenance.period * history[0].Maintenance.PeriodTimeInterval.unitTime;

          auxiliaryData = Math.floor(
            (today.getTime() - maintenance.dueDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          const canReportHistoryPending =
            today >=
              removeDays({
                date: history[0]?.notificationDate,
                days: historyPeriod,
              }) && history[1]?.MaintenancesStatus?.name !== 'expired';

          kanban[maintenance.inProgress ? 2 : 0].maintenances.push({
            id: maintenance.id,
            buildingName: maintenance.Building.name,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            priorityLabel: maintenance.priority?.label,
            priorityColor: maintenance.priority?.color,
            priorityBackgroundColor: maintenance.priority?.backgroundColor,
            serviceOrderNumber: maintenance.serviceOrderNumber,

            // não pode reportar a vencida, se a pendente já está liberada.
            cantReportExpired:
              canReportHistoryPending ||
              history[1]?.id !== maintenance.id ||
              today >= history[0]?.notificationDate,
            // para ordenação
            date: maintenance.dueDate,
            dueDate: maintenance.dueDate,
            label: `Atrasada há ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`,
            type: maintenance.Maintenance.MaintenanceType.name,
            inProgress: maintenance.inProgress,
          });
          break;
        }

        case 'completed':
          kanban[3].maintenances.push({
            id: maintenance.id,
            buildingName: maintenance.Building.name,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            priorityLabel: maintenance.priority?.label,
            priorityColor: maintenance.priority?.color,
            priorityBackgroundColor: maintenance.priority?.backgroundColor,
            serviceOrderNumber: maintenance.serviceOrderNumber,

            // para ordenação
            date: maintenance.resolutionDate,
            dueDate: maintenance.dueDate,
            label: '',
            type: maintenance.Maintenance.MaintenanceType.name,
            inProgress: maintenance.inProgress,
          });
          break;

        case 'overdue':
          auxiliaryData = Math.floor(
            (maintenance.resolutionDate.getTime() - maintenance.dueDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          kanban[3].maintenances.push({
            id: maintenance.id,
            buildingName: maintenance.Building.name,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            priorityLabel: maintenance.priority?.label,
            priorityColor: maintenance.priority?.color,
            priorityBackgroundColor: maintenance.priority?.backgroundColor,
            serviceOrderNumber: maintenance.serviceOrderNumber,
            // para ordenação
            date: maintenance.resolutionDate,
            dueDate: maintenance.dueDate,
            label: `Feita com atraso de ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`,
            type: maintenance.Maintenance.MaintenanceType.name,
            inProgress: maintenance.inProgress,
          });
          break;

        default:
          break;
      }
    }

    return kanban;
  }

  async mountYearsFilters({ buildingId }: { buildingId: string }) {
    const dates = await prisma.maintenanceHistory.groupBy({
      by: ['notificationDate'],

      where: {
        buildingId,
      },
    });

    let years: string[] = [];

    dates.forEach((date) => {
      years.push(String(new Date(date.notificationDate).getFullYear()));
    });

    years = [...new Set(years)];

    years = years.sort((a, b) => (a < b ? -1 : 1));

    return years;
  }

  async findMaintenanceHistory({
    buildingId,
  }: {
    buildingId: string;
    // year: string
  }) {
    // const startDate = new Date(`${'01'}/01/${String(year)}`);
    // const endDate = new Date(`${'12'}/31/${String(year)}`);

    // const startDatePending = new Date(`01/01/${String(year)}`);
    // const endDatePending = new Date(`12/31/${String(year)}`);

    const [MaintenancesHistory, MaintenancesPending] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
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

              Category: {
                select: {
                  id: true,
                  name: true,
                },
              },

              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },

              MaintenanceType: {
                select: {
                  id: true,
                  name: true,
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
            NOT: {
              name: 'pending',
            },
          },

          showToResident: true,

          // OR: [
          //   { notificationDate: { lte: endDate, gte: startDate } },
          //   { resolutionDate: { lte: endDate, gte: startDate } },
          // ],
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
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

              Category: {
                select: {
                  id: true,
                  name: true,
                },
              },

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

              MaintenanceType: {
                select: {
                  id: true,
                  name: true,
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

          showToResident: true,

          // OR: [
          //   { notificationDate: { lte: endDatePending, gte: startDatePending } },
          //   { resolutionDate: { lte: endDatePending, gte: startDatePending } },
          // ],
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

    return { MaintenancesHistory, MaintenancesPending };
  }

  async findSyndicMaintenanceHistory({
    buildingId,
    status,
    showMaintenancePriority,
    startDate,
    endDate,
    categoryIdFilter,
    priorityFilter,
  }: {
    buildingId: string;
    status: string | undefined;
    showMaintenancePriority?: boolean | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    categoryIdFilter: string | undefined;
    priorityFilter: MaintenancePriorityName | undefined;
  }) {
    const [MaintenancesForFilter, MaintenancesHistory] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          notificationDate: true,
        },
        where: {
          buildingId,
          MaintenancesStatus: {
            name: {
              in: status,
            },
          },
          Maintenance: {
            categoryId: categoryIdFilter,
          },
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          dueDate: true,
          inProgress: true,
          daysInAdvance: true,
          priority: showMaintenancePriority,

          Building: {
            select: {
              id: true,
              name: true,

              Banners: {
                select: {
                  id: true,
                  originalName: true,
                  redirectUrl: true,
                  url: true,
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
              MaintenanceType: {
                select: {
                  id: true,
                  name: true,
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
          priorityName: priorityFilter,

          MaintenancesStatus: {
            name: {
              in: status,
            },
          },

          Maintenance: {
            categoryId: categoryIdFilter,
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

    validator.needExist([
      {
        label: 'histórico de manutenção',
        variable: MaintenancesForFilter,
      },
    ]);

    return { MaintenancesForFilter, MaintenancesHistory };
  }

  async findContactInformation({ buildingId }: { buildingId: string }) {
    const buildingContacts = await prisma.userBuildingsPermissions.findMany({
      select: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
      },

      where: {
        buildingId,
        showContact: true,
        User: {
          isBlocked: false,
        },
      },
    });

    validator.needExist([{ label: 'edificação', variable: buildingContacts }]);

    return buildingContacts;
  }

  async findCompanyLogo({ buildingId }: { buildingId: string }) {
    const companyLogo = await prisma.building.findFirst({
      select: {
        Company: {
          select: {
            image: true,
          },
        },
      },
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'Logo da empresa', variable: companyLogo }]);

    return companyLogo?.Company.image;
  }

  async findHomeInformation({ buildingId }: { buildingId: string }) {
    const mainContact = await prisma.building.findFirst({
      select: {
        name: true,
        Banners: {
          select: {
            id: true,
            originalName: true,
            redirectUrl: true,
            url: true,
          },
        },
        Company: {
          select: {
            canAccessTickets: true,
            ticketInfo: true,
            ticketType: true,
          },
        },
        isBlocked: true,
      },
      where: {
        id: buildingId,
        Company: {
          isBlocked: false,
        },
      },
    });

    validator.needExist([{ label: 'edificação', variable: mainContact }]);

    return mainContact;
  }

  async findSettingsData({ buildingNanoId }: { buildingNanoId: string }) {
    const mainContact = await prisma.building.findFirst({
      select: {
        name: true,
        id: true,

        NotificationsConfigurations: {
          select: {
            id: true,
            name: true,
            email: true,
            emailIsConfirmed: true,
            contactNumber: true,
            contactNumberIsConfirmed: true,
            role: true,
            isMain: true,
            showContact: true,
            nanoId: true,
          },

          orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
        },
        Banners: {
          select: {
            originalName: true,
            redirectUrl: true,
            url: true,
            id: true,
          },
          orderBy: { createdAt: 'asc' },
        },

        BuildingFolders: {
          select: {
            BuildingFolder: {
              select: {
                id: true,
                name: true,
                Parent: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                Folders: {
                  select: {
                    id: true,
                    name: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },

                Files: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },
              },
            },
          },

          where: {
            BuildingFolder: {
              parentId: null,
            },
          },
        },
      },
      where: {
        nanoId: buildingNanoId,

        Company: {
          isBlocked: false,
        },
      },
    });

    validator.needExist([{ label: 'edificação', variable: mainContact }]);

    return mainContact;
  }

  async findAnnexes({ buildingId }: { buildingId: string }) {
    const Annexes = await prisma.building.findFirst({
      select: {
        name: true,

        BuildingFolders: {
          select: {
            BuildingFolder: {
              select: {
                id: true,
                name: true,
                Parent: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                Folders: {
                  select: {
                    id: true,
                    name: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },

                Files: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },
              },
            },
          },

          where: {
            BuildingFolder: {
              parentId: null,
            },
          },
        },
      },
      where: {
        id: buildingId,

        Company: {
          isBlocked: false,
        },
      },
    });

    validator.needExist([{ label: 'Anexos', variable: Annexes }]);

    return Annexes;
  }

  async findShowToResidentTickets({ buildingId }: { buildingId: string }) {
    const showToResidentTicket = await prisma.ticket.findMany({
      include: {
        status: true,
        place: true,
        types: {
          select: {
            type: true,
          },
        },
      },
      where: {
        buildingId,
        showToResident: true,
      },
    });

    return showToResidentTicket;
  }

  async findBuildingByNanoId({ buildingNanoId }: { buildingNanoId: string }) {
    const building = await prisma.building.findUnique({
      select: {
        id: true,
        name: true,
        nanoId: true,
      },
      where: {
        nanoId: buildingNanoId,
      },
    });

    validator.needExist([{ label: 'edificação', variable: building }]);

    return building;
  }
}
