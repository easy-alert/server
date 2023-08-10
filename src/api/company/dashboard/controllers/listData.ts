/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { removeDays } from '../../../../utils/dateTime/removeDays';
import { dashboardServices } from '../services/dashboardServices';
import { mask } from '../../../../utils/masks';

export interface ITimeLine {
  buildings: { in: string[] } | undefined;
  categories: { in: string[] } | undefined;
  responsibles: { in: string[] } | undefined;
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
            in: JSON.parse(String(responsibles)),
          }
        : undefined,
    companyId: req.Company.id,
  };
  // console.log(filter);
  const {
    timeLineCompleted,
    timeLineExpired,
    investmentsData,
    completedMaintenancesScore,
    expiredMaintenancesScore,
    pendingMaintenancesScore,
  } = await dashboardServices.getDashboardData(filter);

  const timeLine = [
    {
      name: 'Concluídas',
      data: timeLineCompleted.map((data) => ({
        x: data.resolutionDate,
        // @ts-ignore
        y: data?._count?.resolutionDate || 0,
      })),
    },
    {
      name: 'Vencidas',
      data: timeLineExpired.map((data) => ({
        x: data.dueDate,
        // @ts-ignore
        y: data?._count?.dueDate || 0,
      })),
    },
  ];

  const investments = mask({ type: 'BRL', value: String(investmentsData._sum.cost) });

  const score = {
    data: [
      completedMaintenancesScore._count.resolutionDate,
      expiredMaintenancesScore._count.dueDate,
      pendingMaintenancesScore._count.notificationDate,
    ],
    labels: ['Concluídas', 'Vencidas', 'Pendentes'],
  };

  return res.status(200).json({
    score,
    investments,
    timeLine,
  });
}
