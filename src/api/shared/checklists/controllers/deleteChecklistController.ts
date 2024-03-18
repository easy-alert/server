import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export async function deleteChecklistController(req: Request, res: Response) {
  const { checklistId, mode } = req.params as any as { checklistId: string; mode: TDeleteMode };

  checkValues([
    { label: 'ID da checklist', type: 'string', value: checklistId },
    { label: 'Tipo da exclusão', type: 'string', value: mode },
  ]);

  const { groupId, date, building } = await checklistServices.findById(checklistId);

  await checklistServices.checkAccess({ buildingNanoId: building.nanoId });

  switch (mode) {
    case 'all':
      await checklistServices.deleteMany({ where: { groupId } });
      break;

    case 'thisAndFollowing':
      await checklistServices.deleteMany({ where: { groupId, date: { gte: date } } });
      break;

    default:
      await checklistServices.deleteMany({ where: { id: checklistId } });
      break;
  }

  return res.status(200).json({ ServerMessage: { message: 'Checklist excluído com sucesso.' } });
}
