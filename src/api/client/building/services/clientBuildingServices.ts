import { prisma } from '../../../../../prisma';
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
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;

        case 1:
          months[1].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 2:
          months[2].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 3:
          months[3].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 4:
          months[4].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 5:
          months[5].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 6:
          months[6].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 7:
          months[7].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 8:
          months[8].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 9:
          months[9].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 10:
          months[10].dates.push({
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            dateInfos,
          });
          break;
        case 11:
          months[11].dates.push({
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

  async findMaintenanceHistory({
    buildingId,
    startDate,
    endDate,
  }: {
    buildingId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const [MaintenancesHistory, MaintenancesPending] = await prisma.$transaction([
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
            NOT: {
              name: 'pending',
            },
          },

          OR: [{ notificationDate: { lte: endDate, gte: startDate } }],
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
            name: 'pending',
          },

          OR: [{ notificationDate: { lte: endDate, gte: startDate } }],
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
}
