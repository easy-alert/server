/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

// TYPES
import { Request, Response } from 'express';

// CLASS
import { UserServices } from '../../../../shared/users/user/services/userServices';
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { PermissionServices } from '../../../../shared/permissions/permission/services/permissionServices';
import { UserPermissionServices } from '../../../../shared/users/userPermission/services/userPermissionServices';
import { CompanyServices } from '../services/companyServices';
import { SharedCompanyServices } from '../../../../shared/users/accounts/services/sharedCompanyServices';
import { sendEmailConfirmation } from '../../../../shared/users/user/services/sendEmailConfirmation';
import { sendPhoneConfirmation } from '../../../../shared/users/user/services/sendPhoneConfirmation';
import { createUserPermissions } from '../../../../shared/users/userPermission/services/createUserPermissions';

const validator = new Validator();
const userServices = new UserServices();
const permissionServices = new PermissionServices();
const companyServices = new CompanyServices();
const sharedCompanyServices = new SharedCompanyServices();

export async function createCompanyAndOwner(req: Request, res: Response) {
  const {
    name,
    email,
    password,
    companyName,
    CNPJ,
    CPF,
    contactNumber,
    image,
    isNotifyingOnceAWeek,
    canAccessChecklists,
    canAccessTickets,
    receivePreviousMonthReports,
    receiveDailyDueReports,
  } = req.body;

  validator.notNull([
    { label: 'nome de usuário', variable: name },
    { label: 'e-mail', variable: email },
    { label: 'nome da empresa', variable: companyName },
    { label: 'número para contato', variable: contactNumber },
    { label: 'imagem', variable: image },
  ]);

  const emailLowerCase = email.toLowerCase() as string;

  const checkUser = await userServices.findEmailForCreate({
    email: emailLowerCase,
    phoneNumber: contactNumber,
  });

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
    email: emailLowerCase,
    phoneNumber: contactNumber,
    passwordHash: password,
  });

  const permission = await permissionServices.findByName({ name: 'admin:company' });

  const company = await companyServices.create({
    CNPJ,
    CPF,
    contactNumber,
    image,
    name: companyName,
    isNotifyingOnceAWeek,
    canAccessChecklists,
    canAccessTickets,
    receiveDailyDueReports,
    receivePreviousMonthReports,
  });

  await createUserPermissions({
    data: {
      data: {
        companyId: company.id,
        userId: user.id,
        permissionId: permission!.id,
      },
    },
  });

  await companyServices.createUserCompany({
    companyId: company.id,
    userId: user.id,
    owner: true,
  });

  if (user.email) sendEmailConfirmation({ email: user.email, userId: user.id });
  if (user.phoneNumber) sendPhoneConfirmation({ phoneNumber: user.phoneNumber, userId: user.id });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Usuário cadastrado com sucesso.',
    },
  });
}
