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

interface ISeries {
  name: string;
  data: number[];
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

  // #rengion TimeLine

  /*
  const timeLine = [  //versao antiga
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
    {
      name: 'Pendentes',
      data: timeLinePending.map((data) => ({
        x: data.notificationDate,
        // @ts-ignore
        y: data?._count?.notificationDate || 0,
      })),
    },
  ];
*/

  const series: ISeries[] = [
    {
      name: 'Pendentes',
      data: [],
    },
    {
      name: 'Vencidas',
      data: [],
    },
    {
      name: 'Concluídas',
      data: [],
    },
  ];

  const dates = [
    ...timeLinePending.map((data) => data.notificationDate),
    ...timeLineExpired.map((data) => data.dueDate),
    ...timeLineCompleted.map((data) => data.resolutionDate),
  ];
  // @ts-ignore
  const labels = [...new Set(dates.map((date) => `${date.getMonth() + 1}/${date.getFullYear()}`))];

  labels.forEach((label) => {
    let pendingAmount = 0;
    let expiredAmount = 0;
    let completedAmount = 0;

    // #region pending
    timeLinePending.forEach((data) => {
      const dataPeriod = `${
        data.notificationDate.getMonth() + 1
      }/${data.notificationDate.getFullYear()}`;

      // @ts-ignore
      if (dataPeriod === label) pendingAmount += data._count.notificationDate;
    });
    // #endregion

    // #region expired

    timeLineExpired.forEach((data) => {
      const dataPeriod = `${data.dueDate.getMonth() + 1}/${data.dueDate.getFullYear()}`;

      // @ts-ignore
      if (dataPeriod === label) expiredAmount += data._count.dueDate;
    });
    // #endregion

    // #region compelted

    timeLineCompleted.forEach((data) => {
      const dataPeriod = `${
        data.resolutionDate!.getMonth() + 1
      }/${data.resolutionDate?.getFullYear()}`;

      // @ts-ignore
      if (dataPeriod === label) completedAmount += data._count.resolutionDate;
    });
    // #endregion

    series[0].data.push(pendingAmount);
    series[1].data.push(expiredAmount);
    series[2].data.push(completedAmount);

    pendingAmount = 0;
    expiredAmount = 0;
    completedAmount = 0;
  });

  console.log(series);

  const timeLine = {
    categories: labels,
    series,
  };

  // estrutura desejada
  // const timeLine = {
  //   categories: ['Jan/2023', 'Jan/2023', 'Jan/2023', 'Jan/2023'],
  //   series: [
  //     {
  //       name: 'Concluídas',
  //       data: [1, 0, 0, 1],
  //     },
  //     {
  //       name: 'Vencidas',
  //       data: [2, 2, 2, 2],
  //     },
  //     {
  //       name: 'Pendentes',
  //       data: [3, 1, 3, 5],
  //     },
  //   ],
  // };

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
