import { Response, Request } from 'express';
import { cannotExist, checkPassword, checkValues } from '../../../../../utils/newValidator';
import { userServices } from '../services/userServices';

interface IBody {
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
  const { userId } = req.params;
  const { image, name, role, email, phoneNumber, password, confirmPassword, isBlocked }: IBody =
    req.body;

  checkValues([
    { label: 'ID do usuário', type: 'string', value: userId },
    { label: 'Nome', type: 'string', value: name, required: true },
    { label: 'Email', type: 'email', value: email, required: true },
    { label: 'Telefone', type: 'string', value: phoneNumber, required: true },
    { label: 'Status', type: 'boolean', value: isBlocked, required: true },
    { label: 'Senha', type: 'string', value: password, required: false },
    { label: 'Confirmação de senha', type: 'string', value: confirmPassword, required: false },
  ]);

  checkPassword({ password, confirmPassword });

  const currentUser = await userServices.findEmailPhoneById({ userId });

  if (currentUser && currentUser.email !== email) {
    const existingUserByEmail = await userServices.findUserByEmail({ email });
    cannotExist([{ label: 'Email', variable: existingUserByEmail }]);
  }

  if (currentUser && currentUser.phoneNumber !== phoneNumber) {
    const existingUserByPhone = await userServices.findUserByPhoneNumber({ phoneNumber });
    cannotExist([{ label: 'Telefone', variable: existingUserByPhone }]);
  }

  try {
    const updatedUser = await userServices.updateUser({
      id: userId,
      image,
      name,
      role,
      email,
      phoneNumber,
      isBlocked,
    });

    if (password) {
      await userServices.updateUserPassword({ id: userId, password });
    }

    return res.status(200).json({
      updatedUser,
      ServerMessage: {
        statusCode: 200,
        message: `Informações atualizadas com sucesso.`,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ ServerMessage: { message: 'Erro ao atualizar usuário.' } });
  }
}
