import { Response, Request } from 'express';

import { sendEmailConfirmation } from '../../../shared/users/user/services/sendEmailConfirmation';
import { sendPhoneConfirmation } from '../../../shared/users/user/services/sendPhoneConfirmation';

import { UserServices } from '../../../shared/users/user/services/userServices';
import { UserPermissionServices } from '../../../shared/users/userPermission/services/userPermissionServices';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';
import { CompanyUserServices } from '../services/companyServices';

import { cannotExist, checkPassword, checkValues } from '../../../../utils/newValidator';

const userServices = new UserServices();
const permissionServices = new PermissionServices();
const companyUserServices = new CompanyUserServices();
const userPermissionServices = new UserPermissionServices();

interface IBody {
  image: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export async function createUserController(req: Request, res: Response) {
  const { Company } = req;
  const { image, name, role, email, phoneNumber, password, confirmPassword }: IBody = req.body;

  checkValues([
    { label: 'Nome', type: 'string', value: name },
    { label: 'Email', type: 'email', value: email },
    { label: 'Telefone', type: 'string', value: phoneNumber },
    { label: 'Senha', type: 'string', value: password, required: false },
    { label: 'Confirmação de senha', type: 'string', value: confirmPassword, required: false },
  ]);

  checkPassword({ password, confirmPassword });

  const uniqueUserEmail = await userServices.findUniqueEmail({ email });
  const uniqueUserPhone = await userServices.findUniquePhone({ phoneNumber });

  if (
    uniqueUserEmail &&
    uniqueUserPhone &&
    !uniqueUserEmail.Companies.some((company) => company.companyId === Company.id)
  ) {
    await companyUserServices.createUserCompany({
      companyId: req.Company.id,
      userId: uniqueUserEmail.id,
      owner: false,
    });

    return res.status(201).json({ ServerMessage: { message: 'Usuário cadastrado com sucesso.' } });
  }

  cannotExist([{ label: 'Email', variable: uniqueUserEmail }]);
  cannotExist([{ label: 'Telefone', variable: uniqueUserPhone }]);

  const user = await userServices.create({
    image,
    name,
    role,
    email,
    phoneNumber,
    passwordHash: password,
  });

  const permission = await permissionServices.findByName({ name: 'access:company' });

  await userPermissionServices.createUserPermission({
    userId: user.id,
    permissionId: permission!.id,
  });

  await companyUserServices.createUserCompany({
    companyId: req.Company.id,
    userId: user.id,
    owner: false,
  });

  sendEmailConfirmation({ email, userId: user.id });
  sendPhoneConfirmation({ phoneNumber, userId: user.id });

  return res.status(201).json({ ServerMessage: { message: 'Usuário cadastrado com sucesso.' } });
}
