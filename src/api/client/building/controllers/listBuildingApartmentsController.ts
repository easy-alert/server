import { Response, Request } from 'express';

import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';

import { findCompany } from '../../../shared/company/services/findCompany';

import { checkValues } from '../../../../utils/newValidator';

const buildingServices = new BuildingServices();

export async function listBuildingApartmentsController(req: Request, res: Response) {
  const { buildingId: id } = req.params;

  let buildingId = id;

  checkValues([{ label: 'ID do prédio', type: 'string', value: buildingId }]);

  if (id.length === 12) {
    buildingId = (await buildingServices.findByNanoId({ buildingNanoId: id })).id;
  }

  const companyId = (await findCompany({ buildingId }))?.id;

  if (!companyId) {
    return res.status(404).json({ message: 'Prédio não encontrado' });
  }

  const buildingApartments = await buildingServices.listBuildingApartments({
    companyId,
    buildingId,
  });

  return res.status(200).json({ buildingApartments });
}
