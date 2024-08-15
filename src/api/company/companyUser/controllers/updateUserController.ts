import { Response, Request } from 'express';
import { checkPassword, checkValues } from '../../../../utils/newValidator';
import { UserServices } from '../../../shared/users/user/services/userServices';

interface IBody {
  id: string;
  name: string;
  isBlocked: boolean;
  email: string;
  password: string;
  confirmPassword: string;
}

const userServices = new UserServices();

export async function updateUserController(req: Request, res: Response) {
  const { email, id, isBlocked, name, confirmPassword, password }: IBody = req.body;

  checkValues([
    { label: 'ID do usuário', type: 'string', value: id },
    { label: 'Nome', type: 'string', value: name },
    { label: 'Status', type: 'boolean', value: isBlocked },
    { label: 'Email', type: 'email', value: email },
    { label: 'Senha', type: 'string', value: password, required: false },
    { label: 'Confirmação de senha', type: 'string', value: confirmPassword, required: false },
  ]);

  checkPassword({ password, confirmPassword });

  await userServices.findByEmailForEdit({
    email,
    userId: id,
  });

  await userServices.edit({
    userId: id,
    name,
    email,
    isBlocked,
  });

  if (password) {
    await userServices.editPassword({
      userId: id,
      password,
    });
  }

  return res.status(200).json({ ServerMessage: { message: 'Usuário atualizado com sucesso.' } });
}
