import { Request, Response } from 'express';

import { upsertMaintenanceAdditionalInformation } from '../services/upsertMaintenanceAdditionalInformation';
import { checkValues } from '../../../../../utils/newValidator';

export async function updateMaintenanceAdditionalInformationController(
  req: Request,
  res: Response,
) {
  const { buildingId, maintenanceId, additionalInfo, userResponsibleId } = req.body;

  checkValues([
    { value: buildingId, label: 'Id da edificação', type: 'string' },
    { value: maintenanceId, label: 'Id da manutenção', type: 'string' },
  ]);

  await upsertMaintenanceAdditionalInformation({
    buildingId,
    maintenanceId,
    additionalInfo,
    userResponsibleId,
  });

  return res.status(200).json({ message: 'Informação adicional atualizada com sucesso.' });
}
