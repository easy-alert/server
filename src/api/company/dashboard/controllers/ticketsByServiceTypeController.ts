/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { setToMidnight } from '../../../../utils/dateTime';

export async function ticketsByServiceTypeController(req: Request, res: Response) {
  const { buildings, categories, responsible, startDate, endDate } = req.query;

  const startDateFormatted = startDate ? setToMidnight(startDate as string) : undefined;
  const endDateFormatted = endDate ? setToMidnight(endDate as string) : undefined;

  const dashboardFilter = handleDashboardFilter({
    companyId: req.Company.id,
    buildings: buildings as string[],
    categories: categories as string | string[],
    responsible: responsible as string | string[],
    startDate: startDateFormatted,
    endDate: endDateFormatted,
    permissions: req.Permissions,
    buildingsPermissions: req.BuildingsPermissions,
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
