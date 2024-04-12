import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';

export async function findOccasionalMaintenancesForTicketsController(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingNanoId }]);

  const occasionalMaintenances = await ticketServices.findExistingOccasionalMaintenances({
    buildingNanoId,
  });

  return res.status(200).json({ occasionalMaintenances });
}
