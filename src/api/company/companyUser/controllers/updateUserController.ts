import { Response, Request } from 'express';

import { UserServices } from '../../../shared/users/user/services/userServices';

import { cannotExist, checkPassword, checkValues } from '../../../../utils/newValidator';

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

  const user = await userServices.findEmailPhoneById({ userId: id });

  if (user.email !== email && user.phoneNumber !== phoneNumber) {
    const uniqueUser = await userServices.findUniqueUser({ email, phoneNumber });
    cannotExist([{ label: 'Usuário', variable: uniqueUser }]);
  }

  try {
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
  } catch (error: any) {
    if (error?.meta?.target?.includes('email')) {
      return res.status(400).json({ ServerMessage: { message: 'Email já cadastrado.' } });
    }

    if (error?.meta?.target?.includes('phoneNumber')) {
      return res.status(400).json({ ServerMessage: { message: 'Telefone já cadastrado.' } });
    }

    return res.status(500).json({ ServerMessage: { message: 'Erro ao atualizar usuário.' } });
  }
}
