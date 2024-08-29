import { Response, Request } from 'express';
import { compare } from 'bcrypt';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function validatePasswordController(req: Request, res: Response) {
  const { buildingNanoId, password, type } = req.body as {
    buildingNanoId: string;
    password: string;
    type: 'responsible' | 'resident';
  };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Senha', type: 'string', value: password },
  ]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  let validPassword;

  if (type === 'resident') {
    validPassword = await compare(password, building.residentPassword || '');
  }

  if (type === 'responsible') {
    validPassword = await compare(password, building.syndicPassword || '');
  }

  if (!validPassword && type === 'resident') {
    validPassword = password === building.residentPassword;
  }

  if (!validPassword && type === 'responsible') {
    validPassword = password === building.syndicPassword;
  }

  if (!validPassword) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Senha incorreta.',
    });
  }

  return res.sendStatus(200);
}
