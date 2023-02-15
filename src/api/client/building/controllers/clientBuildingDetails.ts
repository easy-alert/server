// # region IMPORTS
import { Request, Response } from 'express';
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

  const { year, month, status } = req.query;

  // #region VALIDATION

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const building = await buildingServices.findById({ buildingId });

  // #endregion

  const { MaintenancesHistory, MaintenancesPending } =
    await clientBuildingServices.findMaintenanceHistory({
      buildingId,
      status: status ? String(status) : undefined,
      startDate: new Date(`${month ?? '01'}/01/${year ?? new Date().getFullYear()}`),
      endDate: new Date(`${month ?? '12'}/31/${year ?? new Date().getFullYear()}`),
    });

  // #region MOUNTING FILTERS
  const Filters = {
    years: ['2021', '2022', '2023', '2024', '2025'],
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
      { name: 'overdue', label: 'feitas em atrasos' },
    ],
  };

  // #endregion

  // #region PROCESS DATA

  const maintenances = [];
  maintenances.push(...MaintenancesHistory);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: new Date(`${month ?? '12'}/31/${year ?? new Date().getFullYear()}`),
      interval:
        MaintenancesPending[i].Maintenance.frequency *
        MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime,
      maintenanceData: MaintenancesPending[i],
    });
    maintenances.push(...intervals);
  }

  const months = clientBuildingServices.separePerMonth({ data: maintenances });

  // #endregion

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
