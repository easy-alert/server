import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';

export async function deleteChecklistController(req: Request, res: Response) {
  const { checklistId } = req.params as any as { checklistId: string };

  checkValues([{ label: 'ID da checklist', type: 'string', value: checklistId }]);

  await checklistServices.delete(checklistId);

  return res.status(200).json({ ServerMessage: { message: 'Checklist excluída com sucesso.' } });
}
