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

  // #region VALIDATION

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  await buildingServices.findById({ buildingId });

  // #endregion

  // #region PROCESS DATA

  const { MaintenancesHistory, MaintenancesPending } =
    await clientBuildingServices.findMaintenanceHistory({
      buildingId,
      startDate: new Date(`01/01/${new Date().getFullYear()}`),
      endDate: new Date(`12/31/${new Date().getFullYear()}`),
    });

  const maintenances = [];
  maintenances.push(...MaintenancesHistory);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: new Date(`12/31/${new Date().getFullYear()}`),
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
    building: {
      id: MaintenancesHistory[0].Building.id,
      name: MaintenancesHistory[0].Building.name,
      Banners: MaintenancesHistory[0].Building.Banners,
    },
    months,
  });
}
