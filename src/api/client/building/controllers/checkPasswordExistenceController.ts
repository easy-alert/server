import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

export async function checkPasswordExistenceController(req: Request, res: Response) {
  const { buildingNanoId, type } = req.params as {
    buildingNanoId: string;
    type: 'responsible' | 'resident';
  };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Tipo da senha', type: 'string', value: type },
  ]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  if (type === 'resident') {
    return res.status(200).json({ needPassword: !!building.residentPassword });
  }

  return res.status(200).json({ needPassword: !!building.syndicPassword });
}
