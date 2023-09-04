/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { removeDays } from '../../../../utils/dateTime/removeDays';
import { dashboardServices } from '../services/dashboardServices';
import { mask } from '../../../../utils/masks';

interface IResponsible {
  some: {
    name: { in: string[] };
  };
}

export interface IDashboardFilter {
  buildings: { in: string[] } | undefined;
  categories: { in: string[] } | undefined;
  responsibles: IResponsible | undefined;
  period: { gte: Date; lte: Date };
  companyId: string;
}

function getPeriod(period: number | string = 30) {
  const endDate = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      s: 0,
      ms: 0,
    },
  });
  const startDate = removeDays({
    date: endDate,
    days: Number(period),
  });

  return { startDate, endDate };
}

export async function listData(req: Request, res: Response) {
  const { period, buildings, categories, responsibles } = req.query;
  const { startDate, endDate } = getPeriod(period as string | undefined);
  const filter = {
    period: { lte: startDate, gte: endDate },

    buildings:
      buildings && JSON.parse(String(buildings))?.length > 0
        ? {
            in: JSON.parse(String(buildings)),
          }
        : undefined,
    categories:
      categories && JSON.parse(String(categories))?.length > 0
        ? {
            in: JSON.parse(String(categories)),
          }
        : undefined,
    responsibles:
      responsibles && JSON.parse(String(responsibles))?.length > 0
        ? {
            some: {
              name: { in: JSON.parse(String(responsibles)) },
            },
          }
        : undefined,
    companyId: req.Company.id,
  };

  const {
    timeLinePending,
    timeLineCompleted,
    timeLineExpired,
    investmentsData,
    completedMaintenancesScore,
    expiredMaintenancesScore,
    pendingMaintenancesScore,
  } = await dashboardServices.getDashboardData(filter);

  // estrutura desejada
  const timeLine = {
    categories: ['Jan/2023'],
    series: [
      {
        name: 'Concluídas',
        data: [1, 0, 0, 1],
      },
      {
        name: 'Vencidas',
        data: [2, 2, 2, 2],
      },
      {
        name: 'Pendentes',
        data: [3, 1, 3, 5],
      },
    ],
  };

  const investments = mask({ type: 'BRL', value: String(investmentsData._sum.cost) });

  const score = {
    data: [
      completedMaintenancesScore._count.resolutionDate,
      expiredMaintenancesScore._count.dueDate,
      pendingMaintenancesScore._count.notificationDate,
    ],
    labels: ['Concluídas', 'Vencidas', 'Pendentes'],
  };

  const { maintenancesData } = await dashboardServices.getMostCompletedAndExpiredMaintenances({
    filter,
    quantityToReturn: 2,
  });

  return res.status(200).json({
    maintenancesData,
    score,
    investments,
    timeLine,
  });
}
