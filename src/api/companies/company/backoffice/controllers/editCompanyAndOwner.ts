/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS
import { UserServices } from '../../../../users/user/services/userServices';
import { Validator } from '../../../../../utils/validator/validator';
import { CompanyServices } from '../../services/companyServices';

const userServices = new UserServices();
const validator = new Validator();
const companyServices = new CompanyServices();

export async function editCompanyAndOwner(req: Request, _res: Response) {
  const {
    userId,
    name,
    email,
    password,

    image,
    companyId,
    companyName,
    contactNumber,
    CPF,
    CNPJ,
  } = req.body;

  validator.notNull([
    { label: 'ID de usuário', variable: userId },
    { label: 'nome', variable: name },
    { label: 'email', variable: email },
    { label: 'imagem', variable: image },
  ]);

  const checkUser = await userServices.findByEmailForEdit({
    email,
    userId,
  });

  validator.cannotExists([{ variable: checkUser, label: email }]);

  await userServices.edit({
    userId,
    name,
    email,
  });

  await companyServices.edit({
    CNPJ,
    companyId,
    contactNumber,
    CPF,
    image,
    name: companyName,
  });

  if (password) {
    await userServices.editPassword({
      userId,
      password,
    });
  }

  throw new ServerMessage({
    statusCode: 200,
    message: `Informações atualizadas com sucesso.`,
  });
}
