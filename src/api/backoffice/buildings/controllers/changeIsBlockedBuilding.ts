import { Request, Response } from 'express';
import { changeIsBlockedBuilding as changeIsBlockedBuildingService } from '../services/updateBuildingById';

export async function changeIsBlockedBuilding(req: Request, res: Response) {
  const { buildingId } = req.body;
  if (!buildingId) return res.status(400).json({ message: 'ID da edificação é obrigatório.' });

  try {
    const updatedBuilding = await changeIsBlockedBuildingService({ buildingId });

    return res.status(200).json({
      updatedBuilding,
      ServerMessage: {
        statusCode: 200,
        message: `Status da edificação alterado com sucesso.`,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao alterar status da edificação.' });
  }
}
