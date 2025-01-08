/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { getPeriod } from '../../../../utils/dateTime/getPeriod';
import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';

export async function ticketsByServiceTypeController(req: Request, res: Response) {
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

  const { ticketsServicesType, serviceTypes } = await dashboardServices.ticketsByServiceType({
    filter: dashboardFilter,
  });

  const ticketsServiceTypesData: { data: number[]; labels: string[]; colors: string[] } = {
    data: [],
    labels: [],
    colors: [],
  };

  ticketsServicesType.forEach(({ _count, serviceTypeId }) => {
    const typeLabel = serviceTypes.find(({ id }) => id === serviceTypeId)?.label;
    const typeColor = serviceTypes.find(({ id }) => id === serviceTypeId)?.backgroundColor;

    if (typeLabel && typeColor) {
      ticketsServiceTypesData.data.push(_count.ticketId);
      ticketsServiceTypesData.labels.push(typeLabel);
      ticketsServiceTypesData.colors.push(typeColor);
    }
  });

  return res.status(200).json({ ...ticketsServiceTypesData });
}
