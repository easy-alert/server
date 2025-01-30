// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { handleMaintenanceRecentDates } from '../../../../shared/buildingMaintenances/controllers/handleMaintenanceRecentDates';

const buildingServices = new BuildingServices();
const validator = new Validator();
// #endregion

export async function listBuildingDetailsMaintenances(req: Request, res: Response) {
  const { buildingId } = req.params;

  // #region VALIDATION

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const building = await buildingServices.findById({ buildingId });

  // #endregion

  const BuildingMaintenances = await buildingServices.listMaintenances({
    buildingId,
  });

  const BuildingMaintenancesFormatted = BuildingMaintenances.map((category) => ({
    ...category,
    Maintenances: category.Maintenances.map((maintenance) => {
      const recentDates = handleMaintenanceRecentDates(maintenance);

      return {
        ...maintenance,
        Maintenance: {
          ...maintenance.Maintenance,
          ...recentDates,
          MaintenanceAdditionalInformation:
            maintenance.Maintenance.MaintenanceAdditionalInformation[0],
        },
      };
    }),
  }));

  return res
    .status(200)
    .json({ buildingName: building?.name, BuildingMaintenances: BuildingMaintenancesFormatted });
}
