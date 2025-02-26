/* eslint-disable no-shadow */
/* eslint-disable no-loop-func */
// #region IMPORTS
import { Request, Response } from 'express';

import { BuildingReportsServices } from '../services/buildingReportsServices';
import { SharedCalendarServices } from '../../../../shared/calendar/services/SharedCalendarServices';
import { buildingServices } from '../../building/services/buildingServices';

import { setToUTCLastMinuteOfDay } from '../../../../../utils/dateTime';
import { hasAdminPermission } from '../../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../../utils/permissions/handlePermittedBuildings';

import type { IMaintenancesData } from '../services/types';

// CLASS
const buildingReportsServices = new BuildingReportsServices();
const sharedCalendarServices = new SharedCalendarServices();

// #endregion

// #region interfaces
interface MaintenancesStatus {
  name: string;
}
interface Building {
  name: string;
  id: string;
}
interface FrequencyTimeInterval {
  unitTime: number;
}
interface Maintenance {
  id: string;
  element: string;
  activity: string;
  Category: MaintenancesStatus;
  frequency: number;
  FrequencyTimeInterval: FrequencyTimeInterval;
  period: number;
  PeriodTimeInterval: FrequencyTimeInterval;
  source: string;
  responsible: string;
  observation?: any;
  MaintenanceType: MaintenancesStatus;
}

export interface IInterval {
  id: string;
  notificationDate: any;
  resolutionDate?: any;
  inProgress: boolean;
  MaintenanceReport: any[];
  MaintenancesStatus: MaintenancesStatus;
  Building: Building;
  Maintenance: Maintenance;
  isFuture: boolean;
  periodDaysInterval: number;
  expectedNotificationDate: any;
  expectedDueDate: any;
  type: string;
}
// #endregion

// #region Functions
export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// function formatMonthYear(monthYear: string): string {
//   const [month, year] = monthYear.split('-');
//   const monthAbbreviation = new Date(`${year}/${month}/01`)
//     .toLocaleString('pt-br', {
//       month: 'long',
//     })
//     .substring(0, 3);
//   return `${capitalizeFirstLetter(monthAbbreviation)}/${year.slice(2)}`;
// }

// function separateByMonth(array: IMaintenancesData[]) {
//   const separatedByMonth: { [key: string]: IMaintenancesData[] } = {};

//   array.forEach((data) => {
//     const monthYear = `${
//       data.notificationDate.getMonth() + 1
//     }-${data.notificationDate.getFullYear()}`;

//     if (!separatedByMonth[monthYear]) {
//       separatedByMonth[monthYear] = [];
//     }

//     separatedByMonth[monthYear].push(data);
//   });

//   const result = Object.keys(separatedByMonth).map((key) => ({
//     month: formatMonthYear(key),
//     data: separatedByMonth[key],
//   }));

//   return result;
// }

// #endregion

export async function listForBuildingReports(req: Request, res: Response) {
  const queryFilter = buildingReportsServices.mountQueryFilter({ query: req.query as any });

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildings = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  if (!queryFilter.buildingIds || queryFilter.buildingIds?.length === 0) {
    queryFilter.buildingIds = isAdmin ? undefined : permittedBuildings;
  }

  const { maintenancesHistory, MaintenancesPending } =
    await buildingReportsServices.findBuildingMaintenancesHistory({
      companyId: req.Company.id,
      queryFilter,
    });

  let maintenances: IMaintenancesData[] = [];

  for (let i = 0; i < MaintenancesPending.length; i++) {
    if (MaintenancesPending[i].Maintenance?.MaintenanceType?.name === 'occasional') {
      const hasReport = MaintenancesPending[i].MaintenanceReport.length > 0;

      maintenances.push({
        id: MaintenancesPending[i].id,

        dueDate: MaintenancesPending[i].dueDate,
        maintenanceHistoryId: MaintenancesPending[i].id,
        buildingName: MaintenancesPending[i].Building.name,
        categoryName: MaintenancesPending[i].Maintenance.Category.name,
        element: MaintenancesPending[i].Maintenance.element,
        activity: MaintenancesPending[i].Maintenance.activity,
        responsible: MaintenancesPending[i].Maintenance.responsible,
        source: MaintenancesPending[i].Maintenance.source,
        notificationDate: MaintenancesPending[i].notificationDate,
        maintenanceObservation: MaintenancesPending[i].Maintenance.observation,
        resolutionDate: MaintenancesPending[i].resolutionDate,
        status: MaintenancesPending[i].MaintenancesStatus.name,
        type: MaintenancesPending[i].Maintenance.MaintenanceType?.name ?? null,
        inProgress: MaintenancesPending[i].inProgress,

        cost: hasReport ? MaintenancesPending[i].MaintenanceReport[0].cost : null,

        reportObservation: hasReport
          ? MaintenancesPending[i].MaintenanceReport[0].observation
          : null,

        images: hasReport ? MaintenancesPending[i].MaintenanceReport[0].ReportImages : [],
        annexes: hasReport ? MaintenancesPending[i].MaintenanceReport[0].ReportAnnexes : [],
      });
    } else {
      const foundBuildingMaintenance =
        await buildingServices.findBuildingMaintenanceDaysToAnticipate({
          buildingId: MaintenancesPending[i].Building.id,
          maintenanceId: MaintenancesPending[i].Maintenance.id,
        });

      const intervals = sharedCalendarServices.recurringDates({
        startDate: MaintenancesPending[i].notificationDate,
        endDate: setToUTCLastMinuteOfDay(queryFilter.dateFilter.lte),
        interval:
          MaintenancesPending[i].Maintenance.frequency *
            MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime -
          (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        maintenanceData: MaintenancesPending[i],
        periodDaysInterval:
          MaintenancesPending[i].Maintenance.period *
            MaintenancesPending[i].Maintenance.PeriodTimeInterval.unitTime +
          (foundBuildingMaintenance?.daysToAnticipate ?? 0),
      });

      const intervalsTyped: IInterval[] = intervals;

      intervalsTyped.forEach(
        ({
          Building,
          Maintenance,
          MaintenanceReport,
          MaintenancesStatus,
          expectedDueDate,
          expectedNotificationDate,
          id,
          inProgress,
          // notificationDate,
          resolutionDate,
          isFuture,
        }) => {
          const hasReport = MaintenanceReport.length > 0;

          maintenances.push({
            id: Maintenance.id,
            expectedDueDate,
            expectedNotificationDate,
            isFuture,
            maintenanceHistoryId: id,
            buildingName: Building.name,
            categoryName: Maintenance.Category.name,
            element: Maintenance.element,
            activity: Maintenance.activity,
            responsible: Maintenance.responsible,
            source: Maintenance.source,
            // PRO SORT
            dueDate: expectedDueDate,
            notificationDate: expectedNotificationDate,
            maintenanceObservation: Maintenance.observation,
            resolutionDate,
            status: MaintenancesStatus.name,
            type: Maintenance.MaintenanceType?.name ?? null,
            inProgress,

            cost: hasReport ? MaintenanceReport[0].cost : null,

            reportObservation: hasReport ? MaintenanceReport[0].observation : null,

            images: hasReport ? MaintenanceReport[0].ReportImages : [],
            annexes: hasReport ? MaintenanceReport[0].ReportAnnexes : [],
          });
        },
      );
    }
  }

  maintenances = maintenances.filter(
    (data: any) =>
      data[queryFilter.filterBy] >= queryFilter.dateFilter.gte &&
      data[queryFilter.filterBy] <= queryFilter.dateFilter.lte,
  );

  const counts = {
    completed: 0,
    // Nesse momento só tem as pendentes
    pending: maintenances.length,
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

      dueDate: maintenance.dueDate,
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

  // const maintenancesForPDF = separateByMonth(maintenances);
  maintenances.sort((a, b) => b.notificationDate.getTime() - a.notificationDate.getTime());

  return res.status(200).json({ counts, maintenances });
}
