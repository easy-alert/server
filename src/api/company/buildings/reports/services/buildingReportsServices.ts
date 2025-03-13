// #region IMPORTS
import { prisma } from '../../../../../../prisma';
import { differenceInDays, setToUTCMidnight } from '../../../../../utils/dateTime';
import { changeUTCTime } from '../../../../../utils/dateTime/changeTime';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// TYPES
import { IFindBuildingMaintenancesHistory, IListForBuildingReportQuery } from './types';

// // CLASS
// import { Validator } from '../../../../../utils/validator/validator';
// import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// const validator = new Validator();

// #endregion

export class BuildingReportsServices {
  mountQueryFilter({ query }: IListForBuildingReportQuery) {
    if (!query.filterBy) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Selecione qual tipo de data deve ser filtrada.',
      });
    }

    if (!query.startDate || !query.endDate) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você deve informar o intervalo de datas corretamente.',
      });
    }
    // AQUI É UTC PORQUE NÃO CONSEGUI MANDAR CERTO DO FRONT
    const dates = {
      startDate: changeUTCTime({
        date: new Date(String(query.startDate)),
        time: {
          h: 3,
          m: 0,
          s: 0,
          ms: 0,
        },
      }),
      endDate: setToUTCMidnight(query.endDate),
    };

    if (dates.endDate < dates.startDate) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'A data de notificação final deve ser maior que a data de notificação inicial.',
      });
    }

    const FIVE_YEARS_IN_DAYS = 366 * 5;

    if (differenceInDays(dates.endDate, dates.startDate) > FIVE_YEARS_IN_DAYS) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'A diferença entre as datas de notificação não pode exceder 5 anos.',
      });
    }

    const filter = {
      maintenanceStatusIds:
        query.maintenanceStatusIds?.split(',')[0] !== ''
          ? query.maintenanceStatusIds?.split(',')
          : undefined,
      buildingIds:
        query.buildingIds?.split(',')[0] !== '' ? query.buildingIds?.split(',') : undefined,
      categoryNames:
        query.categoryNames?.split(',')[0] !== '' ? query.categoryNames?.split(',') : undefined,
      dateFilter: {
        gte: dates.startDate,
        lte: dates.endDate,
      },
      filterBy: query.filterBy,
    };

    return filter;
  }

  async findForSelectFilterOptions({
    permittedBuildings,
    companyId,
  }: {
    permittedBuildings?: string[];
    companyId: string;
  }) {
    const [buildings, companyCategories, defaultCategories, status] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          id: {
            in: permittedBuildings,
          },
          companyId,
        },
        orderBy: {
          name: 'asc',
        },
      }),

      // sort nesse la em baixo
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          ownerCompanyId: companyId,
        },
      }),

      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          ownerCompanyId: null,
        },
      }),
      // sort nesse la em baixo

      prisma.maintenancesStatus.findMany({
        select: {
          id: true,
          name: true,
          pluralLabel: true,
          singularLabel: true,
        },
        orderBy: {
          singularLabel: 'asc',
        },
      }),
    ]);

    const allCategories = [...companyCategories, ...defaultCategories];

    const sortedCategories = allCategories.sort((a, b) => a.name.localeCompare(b.name));

    const filters = {
      buildings,
      categories: sortedCategories,
      status,
    };

    return { filters };
  }

  async findBuildingMaintenancesHistory({
    companyId,
    queryFilter,
  }: IFindBuildingMaintenancesHistory) {
    // nome diabo pra reaproveitar função
    const [maintenancesHistory, MaintenancesPending, company] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,
          dueDate: true,

          activities: {
            select: {
              title: true,
              content: true,
              type: true,
              createdAt: true,

              images: {
                select: {
                  url: true,
                },
              },
            },
          },

          MaintenanceReport: {
            select: {
              observation: true,
              cost: true,

              ReportAnnexes: {
                select: {
                  url: true,
                  name: true,
                },
              },

              ReportImages: {
                select: {
                  url: true,
                },
              },
            },
          },

          MaintenancesStatus: {
            select: {
              name: true,
            },
          },

          Building: {
            select: {
              name: true,
            },
          },

          Maintenance: {
            select: {
              element: true,
              activity: true,
              Category: {
                select: {
                  name: true,
                },
              },
              source: true,
              responsible: true,
              observation: true,
              MaintenanceType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: { notificationDate: 'desc' },

        where: {
          activities: {
            every: {
              type: 'comment',
            },
          },

          maintenanceStatusId: {
            in: queryFilter.maintenanceStatusIds,
          },

          buildingId: {
            in: queryFilter.buildingIds,
          },

          ownerCompanyId: companyId,

          Maintenance: {
            Category: {
              name: { in: queryFilter.categoryNames },
            },
          },

          [queryFilter.filterBy]: queryFilter.dateFilter,

          MaintenancesStatus: {
            NOT: {
              name: 'pending',
            },
          },
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,
          dueDate: true,

          activities: {
            select: {
              title: true,
              content: true,
              type: true,
              createdAt: true,

              images: {
                select: {
                  url: true,
                },
              },
            },
          },

          MaintenanceReport: {
            select: {
              observation: true,
              cost: true,

              ReportAnnexes: {
                select: {
                  url: true,
                  name: true,
                },
              },

              ReportImages: {
                select: {
                  url: true,
                },
              },
            },
          },

          MaintenancesStatus: {
            select: {
              name: true,
            },
          },

          Building: {
            select: {
              name: true,
              id: true,
            },
          },

          Maintenance: {
            select: {
              id: true,
              element: true,
              activity: true,
              Category: {
                select: {
                  name: true,
                },
              },
              frequency: true,
              FrequencyTimeInterval: {
                select: { unitTime: true },
              },
              period: true,
              PeriodTimeInterval: {
                select: { unitTime: true },
              },
              source: true,
              responsible: true,
              observation: true,
              MaintenanceType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            Building: {
              name: 'asc',
            },
          },
          { notificationDate: 'desc' },
        ],
        where: {
          activities: {
            every: {
              type: 'comment',
            },
          },

          maintenanceStatusId: {
            in: queryFilter.maintenanceStatusIds,
          },

          buildingId: {
            in: queryFilter.buildingIds,
          },

          ownerCompanyId: companyId,

          Maintenance: {
            Category: {
              name: { in: queryFilter.categoryNames },
            },
          },

          [queryFilter.filterBy]: {
            lte: queryFilter.dateFilter.lte,
          },

          MaintenancesStatus: {
            name: 'pending',
          },
        },
      }),

      prisma.company.findUnique({ select: { image: true }, where: { id: companyId } }),
    ]);

    return { maintenancesHistory, MaintenancesPending, company };
  }
}
