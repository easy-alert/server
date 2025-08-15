import { Response, Request } from 'express';

import { compare } from 'bcrypt';

import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

import { checkValues } from '../../../../utils/newValidator';

export async function validatePasswordController(req: Request, res: Response) {
  const { buildingId, password, type } = req.body as {
    buildingId: string;
    password: string;
    type: 'responsible' | 'resident';
  };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Senha', type: 'string', value: password },
  ]);

  let building = null;
  let validPassword;

  if (buildingId.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingId,
    });
  } else {
    building = await buildingServices.findById({ buildingId });
  }

  if (type === 'resident') {
    validPassword = await compare(password, building.residentPassword || '');
  }

  if (!validPassword && type === 'resident') {
    validPassword = password === building.residentPassword;
  }

  if (!validPassword) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Senha incorreta.',
    });
  }

  return res.sendStatus(200);
}
