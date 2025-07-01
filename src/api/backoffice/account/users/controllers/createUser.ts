import { Request, Response } from 'express';
import { registerUser } from '../services/registerUser';
import { checkValues } from '../../../../../utils/newValidator';

export async function createUser(req: Request, res: Response) {
  const { name, image, role, email, phoneNumber, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem.');
    }

    checkValues([
      { label: 'Nome', type: 'string', value: name },
      { label: 'Email', type: 'string', value: email },
      { label: 'Senha', type: 'string', value: password },
      { label: 'Confirmar senha', type: 'string', value: confirmPassword },
      { label: 'Telefone', type: 'string', value: phoneNumber },
    ]);

    const user = await registerUser({
      name,
      image,
      role,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Usuário cadastrado com sucesso.',
      },
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Erro ao cadastrar usuário.',
    });
  }
}
