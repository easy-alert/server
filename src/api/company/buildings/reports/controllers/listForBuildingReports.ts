// #region IMPORTS
import { Request, Response } from 'express';
import { BuildingReportsServices } from '../services/buildingReportsServices';
import { IMaintenancesData } from '../services/types';

// CLASS
const buildingReportsServices = new BuildingReportsServices();

// #endregion

// #region Functions
export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

function formatMonthYear(monthYear: string): string {
  const [month, year] = monthYear.split('-');
  const monthAbbreviation = new Date(`${year}/${month}/01`)
    .toLocaleString('pt-br', {
      month: 'long',
    })
    .substring(0, 3);
  return `${capitalizeFirstLetter(monthAbbreviation)}/${year.slice(2)}`;
}

function separateByMonth(array: IMaintenancesData[]) {
  const separatedByMonth: { [key: string]: IMaintenancesData[] } = {};

  array.forEach((data) => {
    const monthYear = `${
      data.notificationDate.getMonth() + 1
    }-${data.notificationDate.getFullYear()}`;

    if (!separatedByMonth[monthYear]) {
      separatedByMonth[monthYear] = [];
    }

    separatedByMonth[monthYear].push(data);
  });

  const result = Object.keys(separatedByMonth).map((key) => ({
    month: formatMonthYear(key),
    data: separatedByMonth[key],
  }));

  return result;
}

// #endregion

export async function listForBuildingReports(req: Request, res: Response) {
  // @ts-ignore                                         por causa do bug do PaserdQs
  const queryFilter = buildingReportsServices.mountQueryFilter({ query: req.query });

  const { maintenancesHistory } = await buildingReportsServices.findBuildingMaintenancesHistory({
    companyId: req.Company.id,
    queryFilter,
  });

  const maintenances: IMaintenancesData[] = [];
  const counts = {
    completed: 0,
    pending: 0,
    expired: 0,
    totalCost: 0,
  };

  maintenancesHistory.forEach((maintenance) => {
    if (
      maintenance.MaintenanceReport.length > 0 &&
      maintenance.MaintenanceReport[0].cost !== null
    ) {
      counts.totalCost += maintenance.MaintenanceReport[0].cost;
    }

    switch (maintenance.MaintenancesStatus.name) {
      case 'completed':
        counts.completed += 1;
        break;

      case 'overdue':
        counts.completed += 1;
        break;

      case 'pending':
        counts.pending += 1;
        break;

      case 'expired':
        counts.expired += 1;
        break;

      default:
        break;
    }

    const hasReport = maintenance.MaintenanceReport.length > 0;

    maintenances.push({
      id: maintenance.id,

      maintenanceHistoryId: maintenance.id,
      buildingName: maintenance.Building.name,
      categoryName: maintenance.Maintenance.Category.name,
      element: maintenance.Maintenance.element,
      activity: maintenance.Maintenance.activity,
      responsible: maintenance.Maintenance.responsible,
      source: maintenance.Maintenance.source,
      notificationDate: maintenance.notificationDate,
      maintenanceObservation: maintenance.Maintenance.observation,
      resolutionDate: maintenance.resolutionDate,
      status: maintenance.MaintenancesStatus.name,
      type: maintenance.Maintenance.MaintenanceType?.name ?? null,
      inProgress: maintenance.inProgress,

      cost: hasReport ? maintenance.MaintenanceReport[0].cost : null,

      reportObservation: hasReport ? maintenance.MaintenanceReport[0].observation : null,

      images: hasReport ? maintenance.MaintenanceReport[0].ReportImages : [],
      annexes: hasReport ? maintenance.MaintenanceReport[0].ReportAnnexes : [],
    });
  });

  const maintenancesForPDF = separateByMonth(maintenances);

  return res.status(200).json({ counts, maintenances, maintenancesForPDF });
}
