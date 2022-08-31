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
    { label: 'senha', variable: password },
    { label: 'nome da empresa', variable: companyName },
    { label: 'numero para contato', variable: contactNumber },
    { label: 'imagem', variable: image },
  ]);

  const checkUser = await userServices.findByEmail({ email });
  const checkCNPJ = await companyServices.findByCNPJ({ CNPJ });
  const checkCPF = await companyServices.findByCPF({ CPF });

  validator.cannotExists([{ label: 'e-mail', variable: checkUser }]);
  validator.cannotExists([{ label: 'CNPJ', variable: checkCNPJ }]);
  validator.cannotExists([{ label: 'CPF', variable: checkCPF }]);

  const company = await companyServices.create({
    CNPJ,
    contactNumber,
    CPF,
    image,
    name: companyName,
  });

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

  await companyServices.createUserCompany({
    companyId: company.id,
    userId: user.id,
  });

  throw new ServerMessage({
    statusCode: 200,
    message: 'Usuário cadastrado com sucesso.',
  });
}
