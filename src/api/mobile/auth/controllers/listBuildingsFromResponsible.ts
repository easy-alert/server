import { Request, Response } from 'express';
import { AuthMobile } from '../services/authMobile';

// Instância do serviço
const authMobile = new AuthMobile();

export async function listBuildingsFromResponsible(req: Request, res: Response) {
  try {
    // Obtém o phoneNumber da query string
    const { phoneNumber } = req.query;

    // Verifica se o phoneNumber foi enviado
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return res
        .status(400)
        .json({ error: 'O número de telefone é obrigatório e deve ser uma string.' });
    }

    // Chama o serviço para buscar os prédios
    const buildings = await authMobile.listBuildings({ phoneNumber });

    // Retorna os prédios encontrados
    return res.status(200).json(buildings);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
