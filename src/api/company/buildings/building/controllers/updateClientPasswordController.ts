import { Response, Request } from 'express';
import { hashSync } from 'bcrypt';
import { checkEnums, checkPassword, checkValues } from '../../../../../utils/newValidator';
import { buildingServices } from '../services/buildingServices';
import { prisma } from '../../../../../../prisma';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

export async function updateClientPasswordController(req: Request, res: Response) {
  const { password, confirmPassword, buildingId, type } = req.body as {
    password: string | null;
    confirmPassword: string | null;
    buildingId: string;
    type: 'resident' | 'responsible';
  };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Senha', type: 'PIN', value: password, required: !!confirmPassword },
    { label: 'Confirmação de senha', type: 'PIN', value: confirmPassword, required: !!password },
    { label: 'Tipo da senha', type: 'string', value: type },
  ]);

  checkPassword({ password, confirmPassword, passwordMinLength: 4 });

  checkEnums([
    {
      label: 'Tipo da senha',
      value: type,
      enumType: { resident: 'resident', responsible: 'responsible' },
    },
  ]);

  if (password && password.length !== 4) {
    throw new ServerMessage({
      statusCode: 400,
      message: `A senha deve ter 4 dígitos.`,
    });
  }

  await buildingServices.findById({ buildingId });

  if (type === 'resident') {
    await prisma.building.update({
      data: {
        residentPassword: password ? hashSync(password, 12) : null,
      },
      where: {
        id: buildingId,
      },
    });
  }

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Senha alterada com sucesso.`,
    },
  });
}
