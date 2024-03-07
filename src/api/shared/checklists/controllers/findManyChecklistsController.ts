import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';

export async function findManyChecklistsController(req: Request, res: Response) {
  const { buildingId } = req.params as any as { buildingId: string };

  const checklists = await checklistServices.findMany({ buildingId });

  return res.status(200).json({ checklists });
}
