// TYPES
import type { Request, Response } from 'express';

// CLASS
import { UserServices } from '../../../../shared/users/user/services/userServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { PermissionServices } from '../../../../shared/permissions/permission/services/permissionServices';
import { CompanyServices } from '../services/companyServices';
import { SharedCompanyServices } from '../../../../shared/users/accounts/services/sharedCompanyServices';
import { sendEmailConfirmation } from '../../../../shared/users/user/services/sendEmailConfirmation';
import { sendPhoneConfirmation } from '../../../../shared/users/user/services/sendPhoneConfirmation';
import { createUserPermissions } from '../../../../shared/users/userPermission/services/createUserPermissions';

import { cannotExist, checkValues } from '../../../../../utils/newValidator';

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

  checkValues([
    { label: 'nome de usuário', value: name, type: 'string', required: true },
    { label: 'e-mail', value: email, type: 'string', required: true },
    { label: 'nome da empresa', value: companyName, type: 'string', required: true },
    { label: 'número para contato', value: contactNumber, type: 'string', required: true },
    { label: 'imagem', value: image, type: 'string' },
  ]);

  const emailLowerCase = email.toLowerCase() as string;

  const checkEmailUser = await userServices.findUniqueEmail({
    email: emailLowerCase,
  });

  cannotExist([{ label: 'e-mail', variable: checkEmailUser }]);

  const checkEmailPhone = await userServices.findUniquePhone({
    phoneNumber: contactNumber,
  });

  cannotExist([{ label: 'número de contato', variable: checkEmailPhone }]);

  if (!CNPJ && !CPF) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe um CNPJ ou CPF.`,
    });
  }

  if (CNPJ) {
    const checkCNPJ = await sharedCompanyServices.findByCNPJ({ CNPJ });
    cannotExist([{ label: 'CNPJ', variable: checkCNPJ }]);
  }

  if (CPF) {
    const checkCPF = await sharedCompanyServices.findByCPF({ CPF });
    cannotExist([{ label: 'CPF', variable: checkCPF }]);
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
