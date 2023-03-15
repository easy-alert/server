// #region IMPORTS
import { prisma } from '../../../../../../prisma';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
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

    const dates = {
      startDate: changeTime({
        date: new Date(String(query.startDate)),
        time: {
          h: 3,
          m: 0,
          s: 0,
          ms: 0,
        },
      }),
      endDate: changeTime({
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
      maintenanceStatusId:
        query.maintenanceStatusId !== '' ? String(query.maintenanceStatusId) : undefined,
      responsibleSyndicId:
        query.responsibleSyndicId !== '' ? String(query.responsibleSyndicId) : undefined,
      buildingId: query.buildingId !== '' ? String(query.buildingId) : undefined,
      categoryId: query.categoryId !== '' ? String(query.categoryId) : undefined,
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
    const [buildings, companyCategories, defaultCategories, responsibles, status] =
      await prisma.$transaction([
        prisma.building.findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            companyId,
          },
        }),
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
        prisma.buildingNotificationConfiguration.findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            isMain: true,
            Building: {
              companyId,
            },
          },
        }),
        prisma.maintenancesStatus.findMany({
          select: {
            id: true,
            name: true,
            pluralLabel: true,
            singularLabel: true,
          },
        }),
      ]);

    const filters = {
      buildings,
      categories: [...companyCategories, ...defaultCategories],
      responsibles,
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

          MaintenanceReport: {
            select: {
              cost: true,
            },
            where: {
              id: queryFilter.responsibleSyndicId,
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

              NotificationsConfigurations: {
                select: {
                  name: true,
                },
                where: {
                  isMain: true,
                },
              },
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
            },
          },
        },
        orderBy: {
          notificationDate: 'desc',
        },
        where: {
          maintenanceStatusId: queryFilter.maintenanceStatusId,
          buildingId: queryFilter.buildingId,
          ownerCompanyId: companyId,
          Maintenance: {
            categoryId: queryFilter.categoryId,
          },

          OR: queryFilter.dateFilter,
        },
      }),
    ]);

    return { maintenancesHistory };
  }
}
