import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { setToUTCLastMinuteOfDay, setToUTCMidnight } from '../../../../utils/dateTime';

export async function usersActivitiesController(req: Request, res: Response) {
  const { buildings, categories, responsible, startDate, endDate } = req.query;

  const startDateFormatted = startDate ? setToUTCMidnight(startDate as string) : undefined;
  const endDateFormatted = endDate ? setToUTCLastMinuteOfDay(endDate as string) : undefined;

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

  const usersActivities = await dashboardServices.usersActivities({
    filter: dashboardFilter,
  });

  const usersActivitiesArray = usersActivities
    .map((activity) => {
      const { name, MaintenanceHistory, Ticket, Checklist } = activity;

      const maintenanceHistoryCount = MaintenanceHistory.length;
      const ticketCount = Ticket.length;
      const checklistCount = Checklist.length;
      const totalActivities = maintenanceHistoryCount + ticketCount + checklistCount;

      return {
        name,
        maintenanceHistoryCount,
        ticketCount,
        checklistCount,
        totalActivities,
      };
    })
    .sort((a, b) => b.totalActivities - a.totalActivities); // Sort in descending order

  return res.status(200).json({ usersActivitiesArray });
}
