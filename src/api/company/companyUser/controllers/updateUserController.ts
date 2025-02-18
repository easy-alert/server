import { Response, Request } from 'express';
import { checkPassword, checkValues } from '../../../../utils/newValidator';
import { UserServices } from '../../../shared/users/user/services/userServices';

interface IBody {
  id: string;
  image: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  isBlocked: boolean;
}

const userServices = new UserServices();

export async function updateUserController(req: Request, res: Response) {
  const { id, image, name, role, email, phoneNumber, password, confirmPassword, isBlocked }: IBody =
    req.body;

  checkValues([
    { label: 'ID do usuário', type: 'string', value: id },
    { label: 'Nome', type: 'string', value: name },
    { label: 'Email', type: 'email', value: email },
    { label: 'Telefone', type: 'string', value: phoneNumber },
    { label: 'Status', type: 'boolean', value: isBlocked },
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
    image,
    name,
    role,
    email,
    phoneNumber,
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
