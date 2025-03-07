/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { Request, Response } from 'express';

// CLASS
import { UserServices } from '../../../shared/users/user/services/userServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';
import { UserPermissionServices } from '../../../shared/users/userPermission/services/userPermissionServices';

import { CompanyUserServices } from '../services/companyServices';
import { SharedCompanyServices } from '../../../shared/users/accounts/services/sharedCompanyServices';
import { TokenServices } from '../../../../utils/token/tokenServices';
import { AuthServices } from '../../../shared/auth/services/authServices';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

const validator = new Validator();
const userServices = new UserServices();
const permissionServices = new PermissionServices();
const userPermissionServices = new UserPermissionServices();
const companyUserServices = new CompanyUserServices();
const sharedCompanyServices = new SharedCompanyServices();
const tokenServices = new TokenServices();
const authServices = new AuthServices();
const emailTransporter = new EmailTransporterServices();

export async function createCompanyAndOwner(req: Request, res: Response) {
  const { name, email, password, companyName, CNPJ, CPF, contactNumber, image } = req.body;

  validator.notNull([
    { label: 'nome de usuário', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'nome da empresa', variable: companyName },
    { label: 'número para contato', variable: contactNumber },
    { label: 'imagem', variable: image },
  ]);

  const checkUser = await userServices.findEmailForCreate({ email, phoneNumber: contactNumber });

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

  const permission = await permissionServices.findByName({ name: 'admin:company' });

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

  const createdUser = await authServices.findByEmail({ email });

  if (process.env.DATABASE_URL?.includes('production')) {
    await emailTransporter.sendNewCompanyCreated({
      toEmail: 'contato@easyalert.com.br',
      companyName: createdUser.Companies[0].Company.name,
      subject: 'Nova empresa cadastrada',
    });
  }

  await userServices.updateLastAccess({ userId: createdUser.id! });

  const token = tokenServices.generate({
    tokenData: {
      userId: createdUser.id,
      Permissions: createdUser.Permissions,
      Company: createdUser.Companies[0].Company,
    },
  });

  return res.status(200).json({
    Account: {
      User: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        lastAccess: createdUser.lastAccess,
        createdAt: createdUser.createdAt,
        Permissions: createdUser.Permissions,
        BuildingsPermissions: createdUser.UserBuildingsPermissions,
      },
      Company: createdUser.Companies[0].Company,
    },
    token,
  });
}
