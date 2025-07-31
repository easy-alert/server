import type { Request, Response } from 'express';

import { deleteGuarantee } from '../../../../shared/guarantee/plan/services/deleteGuarantee';

export async function deleteGuaranteeController(req: Request, res: Response) {
  const { guaranteeId } = req.params;

  await deleteGuarantee({
    data: {
      where: {
        id: guaranteeId,
      },
    },
  });

  return res.status(201).json({
    ServerMessage: {
      statusCode: 201,
      message: 'Garantia deletada com sucesso',
    },
  });
}
