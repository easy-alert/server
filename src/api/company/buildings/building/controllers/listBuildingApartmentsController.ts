import { Response, Request } from 'express';

import { buildingServices } from '../services/buildingServices';
import { checkValues } from '../../../../../utils/newValidator';

export async function listBuildingApartmentsController(req: Request, res: Response) {
  const { id: companyId } = req.Company;
  const { buildingId: id } = req.params;

  let buildingId = id;

  checkValues([{ label: 'ID do prédio', type: 'string', value: buildingId }]);

  if (id.length === 12) {
    buildingId = (await buildingServices.findByNanoId({ buildingNanoId: id })).id;
  }

  const buildingApartments = await buildingServices.listBuildingApartments({
    companyId,
    buildingId,
  });

  return res.status(200).json({ buildingApartments });
}
