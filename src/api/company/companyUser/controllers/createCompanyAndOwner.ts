/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { Request, Response } from 'express';

// CLASS
import { UserServices } from '../../../shared/users/user/services/userServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { PermissionServices } from '../../../shared/permission/services/permissionServices';
import { UserPermissionServices } from '../../../shared/users/userPermission/services/userPermissionServices';

import { CompanyUserServices } from '../services/companyServices';
import { SharedCompanyServices } from '../../../shared/users/accounts/services/sharedCompanyServices';
// import { TokenServices } from '../../../../utils/token/tokenServices';

const validator = new Validator();
const userServices = new UserServices();
const permissionServices = new PermissionServices();
const userPermissionServices = new UserPermissionServices();
const companyUserServices = new CompanyUserServices();
const sharedCompanyServices = new SharedCompanyServices();
// const tokenServices = new TokenServices();

export async function createCompanyAndOwner(req: Request, res: Response) {
  const { name, email, password, companyName, CNPJ, CPF, contactNumber, image } = req.body;

  validator.notNull([
    { label: 'nome de usuário', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'nome da empresa', variable: companyName },
    { label: 'número para contato', variable: contactNumber },
    { label: 'imagem', variable: image },
  ]);

  const checkUser = await userServices.findEmailForCreate({ email });

  validator.cannotExists([{ label: 'e-mail', variable: checkUser }]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }
  if (CNPJ) {
    const checkCNPJ = await sharedCompanyServices.findByCNPJ({ CNPJ });
    validator.cannotExists([{ label: 'CNPJ', variable: checkCNPJ }]);
  }
  if (CPF) {
    const checkCPF = await sharedCompanyServices.findByCPF({ CPF });
    validator.cannotExists([{ label: 'CPF', variable: checkCPF }]);
  }

  const user = await userServices.create({
    name,
    email,
    passwordHash: password,
  });

  const permission = await permissionServices.findByName({ name: 'Company' });

  await userPermissionServices.createUserPermission({
    userId: user.id,
    permissionId: permission!.id,
  });

  const company = await companyUserServices.create({
    CNPJ,
    CPF,
    contactNumber,
    image,
    name: companyName,
  });

  await companyUserServices.createUserCompany({
    companyId: company.id,
    userId: user.id,
    owner: true,
  });

  await userServices.updateLastAccess({ userId: user.id! });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: 'Cadastro de teste efetuado com sucesso.',
    },
  });

  // const createdCompany = await sharedCompanyServices.findById({
  //   companyId: company.id,
  // });

  // const token = tokenServices.generate({
  //   tokenData: {
  //     userId: createdCompany.id,
  //     Permissions: createdCompany.Permissions,
  //     Company: createdCompany.Companies[0],
  //   },
  // });

  // return res.status(200).json({
  //   ServerMessage: {
  //     statusCode: 201,
  //     message: 'Cadastro efetuado com sucesso.',
  //   },
  //   Account: {
  //     User: {
  //       id: createdCompany.id,
  //       image: createdCompany.image,
  //       name: createdCompany.name,
  //       email: createdCompany.email,
  //       lastAccess: createdCompany.lastAccess,
  //       createdAt: createdCompany.createdAt,
  //       Permissions: createdCompany.Permissions,
  //     },
  //     Company: createdCompany.Companies[0].Company,
  //   },
  //   token,
  // });
}
