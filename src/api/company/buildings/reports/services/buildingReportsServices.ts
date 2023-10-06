// #region IMPORTS
import { prisma } from '../../../../../../prisma';
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
    if (query.startDate === '' || query.endDate === '') {
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
      endDate: changeUTCTime({
        date: new Date(String(query.endDate)),
        time: {
          h: 3,
          m: 0,
          s: 0,
          ms: 0,
        },
      }),
    };

    if (dates.endDate < dates.startDate) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'A data final deve ser maior que a data inicial.',
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
      dateFilter: [
        {
          notificationDate: {
            gte: dates.startDate,
            lte: dates.endDate,
          },
        },
        // {
        //   resolutionDate: {
        //     lte: new Date(new Date(String(query.endDate)).toISOString().split('T')[0]),
        //     gte: new Date(new Date(String(query.startDate)).toISOString().split('T')[0]),
        //   },
        // },
      ],
    };

    return filter;
  }

  async findForSelectFilterOptions({ companyId }: { companyId: string }) {
    const [buildings, companyCategories, defaultCategories, status] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
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
    const [maintenancesHistory] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,

          MaintenanceReport: {
            select: {
              observation: true,
              cost: true,
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
          OR: queryFilter.dateFilter,
        },
      }),
    ]);

    return { maintenancesHistory };
  }
}
