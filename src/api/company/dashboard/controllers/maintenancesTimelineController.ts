/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { getPeriod } from '../../../../utils/dateTime/getPeriod';
import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';

function getMonthLabel(label: string) {
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  const [month, year] = label.split('/');

  return `${months[Number(month) - 1]}/${year}`;
}

export async function maintenancesTimelineController(req: Request, res: Response) {
  const { period, buildings, categories, responsible } = req.query;
  const { startDate, endDate } = getPeriod(period as string | undefined);

  const dashboardFilter = handleDashboardFilter({
    buildings: buildings as string | string[],
    categories: categories as string | string[],
    responsible: responsible as string | string[],
    startDate,
    endDate,
    companyId: req.Company.id,
  });

  const { timeLineCompleted, timeLineExpired, timeLinePending } =
    await dashboardServices.maintenanceByTimeLine({
      filter: dashboardFilter,
    });

  const series: { name: string; data: number[] }[] = [
    {
      name: 'Concluídas',
      data: [],
    },
    {
      name: 'Vencidas',
      data: [],
    },
    {
      name: 'Pendentes',
      data: [],
    },
  ];

  const dates = [
    ...timeLinePending.map((data) => data.notificationDate),
    ...timeLineExpired.map((data) => data.dueDate),
    ...timeLineCompleted.map((data) => data.resolutionDate),
  ];

  dates.sort((a, b) => (a && b && a < b ? -1 : 1));

  let labels: string[] = [];

  if (dates.length > 0)
    labels = [...new Set(dates.map((date) => `${date!.getMonth() + 1}/${date!.getFullYear()}`))];

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

    // #region completed

    timeLineCompleted.forEach((data) => {
      const dataPeriod = `${
        data.resolutionDate!.getMonth() + 1
      }/${data.resolutionDate?.getFullYear()}`;

      // @ts-ignore
      if (dataPeriod === label) completedAmount += data._count.resolutionDate;
    });
    // #endregion

    series[0].data.push(completedAmount);
    series[1].data.push(expiredAmount);
    series[2].data.push(pendingAmount);

    pendingAmount = 0;
    expiredAmount = 0;
    completedAmount = 0;
  });

  const maintenancesTimeline = {
    categories: labels.map((label) => getMonthLabel(label)),
    series,
  };

  // #endregion

  return res.status(200).json({ ...maintenancesTimeline });
}
