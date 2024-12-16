import { Request, Response } from 'express';
import { AuthMobile } from '../services/authMobile';

// Instância do serviço
const authMobile = new AuthMobile();

export async function listBuildingsFromResponsible(req: Request, res: Response) {
  try {
    // Obtém o phoneNumber da query string
    const { email, phoneNumber, password, createPassword } = req.body;

    if (createPassword) {
      // Altera a senha do usuário
      await authMobile.changePassword({ email, phoneNumber, password });
    }

    if ((email || phoneNumber) && password) {
      // Verifica se o usuário pode logar
      const user = await authMobile.login({ email, phoneNumber, password });

      if (!user) {
        return res.status(200).json({ error: 'Usuário não encontrado ou senha incorreta.' });
      }

      // Chama o serviço para buscar os prédios
      const buildings = await authMobile.listBuildings({ phoneNumber });

      return res.status(200).json({ buildings });
    }

    if (email || phoneNumber) {
      // Verifica se o usuário pode logar
      const { canLogin, hasPassword } = await authMobile.canLogin({ email, phoneNumber });

      return res.status(200).json({ canLogin, hasPassword });
    }

    return res.status(400).json({ error: 'Parâmetros inválidos.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
