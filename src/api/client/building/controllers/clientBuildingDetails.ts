// # region IMPORTS
import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';
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
  const { buildingId } = req.params;

  const YEARFORSUM = 5;

  // #region VALIDATION

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  let building = null;

  if (buildingId.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingId,
    });
  } else {
    building = await buildingServices.findById({ buildingId });
  }

  // #endregion

  const { MaintenancesHistory, MaintenancesPending } =
    await clientBuildingServices.findMaintenanceHistory({
      buildingId: building.id,
      // year: String(year),
    });

  const showToResidentTicket = await clientBuildingServices.findShowToResidentTickets({
    buildingId: building.id,
  });

  // #region PROCESS DATA

  const maintenances = [];

  maintenances.push(...showToResidentTicket);

  const maintenancesHistoryWithType = MaintenancesHistory.map((maintenance) => ({
    ...maintenance,
    type: maintenance.Maintenance.MaintenanceType?.name || null,
  }));

  maintenances.push(...maintenancesHistoryWithType);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const foundBuildingMaintenance = await buildingServices.findBuildingMaintenanceDaysToAnticipate(
      {
        buildingId: building.id,
        maintenanceId: MaintenancesPending[i].Maintenance.id,
      },
    );

    if (MaintenancesPending[i].Maintenance?.MaintenanceType?.name === 'occasional') {
      maintenances.push({ ...MaintenancesPending[i], type: 'occasional' });
    } else {
      const intervals = sharedCalendarServices.recurringDates({
        startDate: changeTime({
          date: new Date(MaintenancesPending[i].notificationDate),
          time: { h: 0, m: 0, ms: 0, s: 0 },
        }),
        endDate: changeTime({
          date: new Date(`12/31/${new Date().getFullYear() + YEARFORSUM}`),
          time: { h: 0, m: 0, ms: 0, s: 0 },
        }),
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

      maintenances.push(...intervals);
    }
  }

  const months = clientBuildingServices.separePerMonth({
    data: maintenances,
  });

  // #region MOUNT FILTER
  let yearsFiltered: string[] = [];

  // só menor, porque o dynamic years adiciona o ano atual
  maintenances.forEach((date) => {
    if (new Date(date.notificationDate).getFullYear() < new Date().getFullYear()) {
      yearsFiltered.push(String(new Date(date.notificationDate).getFullYear()));
    }
  });

  yearsFiltered = [...new Set(yearsFiltered)];

  yearsFiltered = [
    ...yearsFiltered,
    ...DynamicFutureYears({ initialYear: new Date().getFullYear(), yearsForSum: 5 }),
  ];

  yearsFiltered = yearsFiltered.sort((a, b) => (a < b ? -1 : 1));

  const Filters = {
    years: yearsFiltered,
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
