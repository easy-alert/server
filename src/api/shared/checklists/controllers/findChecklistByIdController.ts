import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function findChecklistByIdController(req: Request, res: Response) {
  const { checklistId } = req.params as any as { checklistId: string };

  checkValues([{ label: 'ID da checklist', type: 'string', value: checklistId }]);

  const checklist = await checklistServices.findById(checklistId);

  if (!checklist.building.Company?.canAccessChecklists) {
    throw new ServerMessage({
      statusCode: 403,
      message: `Sua empresa não possui acesso a este módulo.`,
    });
  }

  return res.status(200).json({ checklist });
}
