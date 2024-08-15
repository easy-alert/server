import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { prisma } from '../../../../../prisma';
import { UserServices } from '../../../shared/users/user/services/userServices';

const userServices = new UserServices();

export async function deleteUserController(req: Request, res: Response) {
  const { userId } = req.params as { userId: string };

  checkValues([{ label: 'ID do usuário', type: 'string', value: userId }]);

  await userServices.findById({ userId });

  await prisma.user.delete({ where: { id: userId } });

  return res.status(200).json({ ServerMessage: { message: 'Usuário excluído com sucesso.' } });
}
