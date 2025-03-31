import { Response, Request } from 'express';

import { CompanyUserServices } from '../services/companyServices';

import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

const companyUserServices = new CompanyUserServices();

interface IBody {
  userInfo: string;
}

export async function linkUserController(req: Request, res: Response) {
  const { companyId } = req;
  const { userInfo }: IBody = req.body;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId },
    { label: 'Informações do usuário', type: 'string', value: userInfo },
  ]);

  const user = await companyUserServices.findByEmailOrPhone({
    userInfo,
  });

  if (!user) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Usuário não encontrado para vincular.',
    });
  }

  const userCompany = await companyUserServices.findUserCompany({
    userId: user.id,
    companyId,
  });

  if (userCompany) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Usuário já vinculado a esta empresa.',
    });
  }

  await companyUserServices.createUserCompany({
    companyId,
    userId: user.id,
    owner: false,
  });

  return res.status(201).json({ ServerMessage: { message: 'Usuário vinculado com sucesso.' } });
}
