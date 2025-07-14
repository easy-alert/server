import { Request, Response } from 'express';
import { changeIsBlockedBuilding as changeIsBlockedBuildingService } from '../services/updateBuildingById';
import { checkValues } from '../../../../utils/newValidator';

export async function changeIsBlockedBuilding(req: Request, res: Response) {
  const { buildingId } = req.body;

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingId }]);

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
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao alterar status da edificação.',
      },
    });
  }
}
