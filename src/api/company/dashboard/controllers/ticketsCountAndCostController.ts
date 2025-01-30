import { Request, Response } from 'express';
import type { TicketStatusName } from '@prisma/client';

import { dashboardServices } from '../services/dashboardServices';

import { getPeriod } from '../../../../utils/dateTime/getPeriod';
import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';

export async function ticketsCountAndCostController(req: Request, res: Response) {
  const { period, buildings, categories, responsible, ticketStatus } = req.query;
  const { startDate, endDate } = getPeriod(period as string | undefined);

  const dashboardFilter = handleDashboardFilter({
    companyId: req.Company.id,
    buildings: buildings as string[],
    categories: categories as string | string[],
    responsible: responsible as string | string[],
    startDate,
    endDate,
    permissions: req.Permissions,
    buildingsPermissions: req.BuildingsPermissions,
  });

  const countAndCostTickets = await dashboardServices.ticketsCountAndCost({
    filter: dashboardFilter,
    ticketStatus: ticketStatus ? (ticketStatus as TicketStatusName) : undefined,
  });

  return res.status(200).json({ ...countAndCostTickets });
}
