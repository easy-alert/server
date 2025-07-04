import { Request, Response } from 'express';
import { userServices } from '../services/userServices';

export async function changeIsBlockedUser(req: Request, res: Response) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'ID do usuário é obrigatório.' });

  try {
    const updatedUser = await userServices.changeIsBlocked({ userId });
    return res.status(200).json({
      updatedUser,
      ServerMessage: {
        statusCode: 200,
        message: `Status alterado com sucesso.`,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao alterar status.' });
  }
}
