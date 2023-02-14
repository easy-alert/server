// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

// CLASS

const clienBuildingServices = new ClientBuildingServices();
const buildingServices = new BuildingServices();

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

  const MaintenancesHistory = await clienBuildingServices.findMaintenanceHistory({
    buildingId,
    startDate: new Date(`01/01/${new Date().getFullYear()}`),
    endDate: new Date(`12/31/${new Date().getFullYear()}`),
  });

  const months = clienBuildingServices.separePerMonth({ data: MaintenancesHistory });

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
