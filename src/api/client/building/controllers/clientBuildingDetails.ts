// # region IMPORTS
import { Request, Response } from 'express';
import { DynamicFutureYears } from '../../../../utils/dateTime/dynamicFutureYears';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

// CLASS

const clientBuildingServices = new ClientBuildingServices();
const buildingServices = new BuildingServices();
const sharedCalendarServices = new SharedCalendarServices();

const validator = new Validator();
// #endregion

export async function clientBuildingDetails(req: Request, res: Response) {
  const YEARFORSUM = 5;

  const { buildingNanoId } = req.params;
  const { year } = req.query;

  // #region VALIDATION

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingNanoId,
    },
  ]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  // #endregion

  const { MaintenancesHistory, MaintenancesPending } =
    await clientBuildingServices.findMaintenanceHistory({
      buildingId: building.id,
      year: String(year),
    });

  const filterYears = DynamicFutureYears({ showFutureYears: true });

  // #region MOUNTING FILTERS
  const Filters = {
    years: filterYears,
    months: [
      {
        monthNumber: '01',
        label: 'janeiro',
      },
      {
        monthNumber: '02',
        label: 'fevereiro',
      },
      {
        monthNumber: '03',
        label: 'março',
      },
      {
        monthNumber: '04',
        label: 'abril',
      },
      {
        monthNumber: '05',
        label: 'maio',
      },
      {
        monthNumber: '06',
        label: 'junho',
      },
      {
        monthNumber: '07',
        label: 'julho',
      },
      {
        monthNumber: '08',
        label: 'agosto',
      },
      {
        monthNumber: '09',
        label: 'setembro',
      },
      {
        monthNumber: '10',
        label: 'outubro',
      },
      {
        monthNumber: '11',
        label: 'novembro',
      },
      {
        monthNumber: '12',
        label: 'dezembro',
      },
    ],
    status: [
      { name: 'expired', label: 'vencidas' },
      { name: 'pending', label: 'pendentes' },
      { name: 'completed', label: 'concluídas' },
      { name: 'overdue', label: 'feitas em atraso' },
    ],
  };

  // #endregion

  // #region PROCESS DATA

  const maintenances = [];
  maintenances.push(...MaintenancesHistory);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: new Date(`12/31/${new Date().getFullYear() + YEARFORSUM}`),
      interval:
        MaintenancesPending[i].Maintenance.frequency *
        MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime,
      maintenanceData: MaintenancesPending[i],
      periodDaysInterval:
        MaintenancesPending[i].Maintenance.period *
        MaintenancesPending[i].Maintenance.PeriodTimeInterval.unitTime,
    });

    maintenances.push(...intervals);
  }

  const months = clientBuildingServices.separePerMonth({ data: maintenances });

  // #endregion

  for (let i = 0; i < months.length; i++) {
    months[i].dates.sort((a: any, b: any) =>
      a.dateInfos.dayNumber > b.dateInfos.dayNumber ? 1 : -1,
    );
  }

  return res.status(200).json({
    Filters,
    building: {
      id: building?.id,
      name: building?.name,
      Banners: building?.Banners,
    },
    months,
  });
}
