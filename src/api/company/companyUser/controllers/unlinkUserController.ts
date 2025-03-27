import { Response, Request } from 'express';

import { prisma } from '../../../../../prisma';

import { UserServices } from '../../../shared/users/user/services/userServices';
import { CompanyUserServices } from '../services/companyServices';

import { checkValues } from '../../../../utils/newValidator';

const userServices = new UserServices();
const companyUserServices = new CompanyUserServices();

export async function unlinkUserController(req: Request, res: Response) {
  const { companyId } = req as { companyId: string };
  const { userId } = req.params as { userId: string };

  checkValues([{ label: 'ID do usuário', type: 'string', value: userId }]);

  await userServices.findById({ userId });

  await companyUserServices.unlinkUserCompany({ userId, companyId });

  return res.status(200).json({ ServerMessage: { message: 'Usuário desvinculados com sucesso.' } });
}
