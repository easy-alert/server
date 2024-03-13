// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { defaultMaintenanceTemplateServices } from '../../../../shared/defaultMaintenanceTemplates/services/defaultMaintenanceTemplateServices';

const buildingServices = new BuildingServices();
const validator = new Validator();

// #endregion

export async function listBuildingsAndTemplatesForSelect(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  await buildingServices.findById({ buildingId });

  const BuildingsForSelect: {
    id: string;
    name: string;
  }[] = await buildingServices.listForSelect({
    companyId: req.Company.id,
    buildingId,
  });

  const templates = await defaultMaintenanceTemplateServices.listTemplatesForSelect();

  BuildingsForSelect.push(...templates);

  return res.status(200).json(BuildingsForSelect);
}
