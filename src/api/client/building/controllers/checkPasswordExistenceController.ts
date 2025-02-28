import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

export async function checkPasswordExistenceController(req: Request, res: Response) {
  const { buildingId, type } = req.params as {
    buildingId: string;
    type: 'responsible' | 'resident';
  };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Tipo da senha', type: 'string', value: type },
  ]);

  let building = null;

  if (buildingId.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingId,
    });
  } else {
    building = await buildingServices.findById({ buildingId });
  }

  if (type === 'resident') {
    return res
      .status(200)
      .json({ needPassword: !!building.residentPassword, buildingName: building.name });
  }

  return res
    .status(200)
    .json({ needPassword: !!building.syndicPassword, buildingName: building.name });
}
