import { Response, Request } from 'express';
import { cannotExist, checkPassword, checkValues } from '../../../../../utils/newValidator';
import { userServices } from '../services/userServices';

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

export async function editUserController(req: Request, res: Response) {
  const { id, image, name, role, email, phoneNumber, password, confirmPassword, isBlocked }: IBody =
    req.body;

  checkValues([
    { label: 'ID do usuário', type: 'string', value: id },
    { label: 'Nome', type: 'string', value: name, required: true },
    { label: 'Email', type: 'email', value: email, required: true },
    { label: 'Telefone', type: 'string', value: phoneNumber, required: true },
    { label: 'Status', type: 'boolean', value: isBlocked, required: true },
    { label: 'Senha', type: 'string', value: password, required: false },
    { label: 'Confirmação de senha', type: 'string', value: confirmPassword, required: false },
  ]);

  checkPassword({ password, confirmPassword });

  const user = await userServices.findEmailPhoneById({ userId: id });

  if (user && (user.email !== email || user.phoneNumber !== phoneNumber)) {
    const uniqueUser = await userServices.findUniqueUser({ email, phoneNumber });
    cannotExist([{ label: 'Usuário', variable: uniqueUser }]);
  }

  try {
    const updatedUser = await userServices.updateUser({
      id,
      image,
      name,
      role,
      email,
      phoneNumber,
      isBlocked,
    });

    if (password) {
      await userServices.updateUserPassword({ id, password });
    }

    return res.status(200).json({
      updatedUser,
      ServerMessage: {
        statusCode: 200,
        message: `Informações atualizadas com sucesso.`,
      },
    });
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
