import { Response, Request } from 'express';
import { cannotExist, checkPassword, checkValues } from '../../../../utils/newValidator';
import { UserServices } from '../../../shared/users/user/services/userServices';
import { UserPermissionServices } from '../../../shared/users/userPermission/services/userPermissionServices';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';
import { CompanyUserServices } from '../services/companyServices';

interface IBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const userServices = new UserServices();
const permissionServices = new PermissionServices();
const companyUserServices = new CompanyUserServices();
const userPermissionServices = new UserPermissionServices();

export async function createUserController(req: Request, res: Response) {
  const { email, name, confirmPassword, password }: IBody = req.body;

  checkValues([
    { label: 'Nome', type: 'string', value: name },
    { label: 'Email', type: 'email', value: email },
    { label: 'Senha', type: 'string', value: password, required: false },
    { label: 'Confirmação de senha', type: 'string', value: confirmPassword, required: false },
  ]);

  checkPassword({ password, confirmPassword });

  const checkUser = await userServices.findEmailForCreate({ email });
  cannotExist([{ label: 'Email', variable: checkUser }]);

  const user = await userServices.create({
    email,
    name,
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

  return res.status(201).json({ ServerMessage: { message: 'Usuário cadastrado com sucesso.' } });
}
