import { Request, Response } from 'express';
import type { TicketStatusName } from '@prisma/client';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { setToLastMinuteOfDay, setToMidnight } from '../../../../utils/dateTime';

export async function ticketsCountAndCostController(req: Request, res: Response) {
  const { buildings, categories, responsible, ticketStatus, startDate, endDate } = req.query;

  const startDateFormatted = startDate ? setToMidnight(startDate as string) : undefined;
  const endDateFormatted = endDate ? setToLastMinuteOfDay(endDate as string) : undefined;

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

  const countAndCostTickets = await dashboardServices.ticketsCountAndCost({
    filter: dashboardFilter,
    ticketStatus: ticketStatus ? (ticketStatus as TicketStatusName) : undefined,
  });

  return res.status(200).json({ ...countAndCostTickets });
}
