/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { NextFunction, Request, Response } from 'express';

// CLASS
import { UserServices } from '../../../users/user/services/userServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { PermissionServices } from '../../../permission/services/permissionServices';
import { UserPermissionServices } from '../../../users/userPermission/services/userPermissionServices';
import { CompanyServices } from '../services/companyServices';

const validator = new Validator();
const userServices = new UserServices();
const permissionServices = new PermissionServices();
const userPermissionServices = new UserPermissionServices();
const companyServices = new CompanyServices();

export async function createCompanyAndOwner(
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const {
    name,
    email,
    password,
    companyName,
    CNPJ,
    CPF,
    contactNumber,
    image,
  } = req.body;

  validator.notNull([
    { label: 'nome de usuário', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'nome da empresa', variable: companyName },
    { label: 'numero para contato', variable: contactNumber },
    { label: 'imagem', variable: image },
  ]);
  let checkCPF = null;
  let checkCNPJ = null;

  const checkUser = await userServices.findByEmail({ email });
  validator.cannotExists([{ label: 'e-mail', variable: checkUser }]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }
  if (CNPJ) {
    checkCNPJ = await companyServices.findByCNPJ({ CNPJ });
    validator.cannotExists([{ label: 'CNPJ', variable: checkCNPJ }]);
  }
  if (CPF) {
    checkCPF = await companyServices.findByCPF({ CPF });
    validator.cannotExists([{ label: 'CPF', variable: checkCPF }]);
  }

  const user = await userServices.create({
    name,
    email,
    passwordHash: password,
  });

  const permission = await permissionServices.findByName({ name: 'User' });

  await userPermissionServices.createUserPermission({
    userId: user.id,
    permissionId: permission!.id,
  });

  const company = await companyServices.create({
    CNPJ,
    CPF,
    contactNumber,
    image,
    name: companyName,
  });

  await companyServices.createUserCompany({
    companyId: company.id,
    userId: user.id,
    owner: true,
  });

  throw new ServerMessage({
    statusCode: 200,
    message: 'Usuário cadastrado com sucesso.',
  });
}
