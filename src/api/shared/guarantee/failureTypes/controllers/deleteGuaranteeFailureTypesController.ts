import type { Request, Response } from 'express';
import type { GuaranteeFailureType } from '@prisma/client';

import { deleteGuaranteeFailureTypes } from '../services/deleteGuaranteeFailureTypes';
import { checkValues } from '../../../../../utils/newValidator';

interface IQuery {
  guaranteeFailureTypeId: string;
}

export async function deleteGuaranteeFailureTypesController(req: Request, res: Response) {
  const { guaranteeFailureTypeId } = req.params as unknown as IQuery;

  checkValues([
    { label: 'ID do tipo de falha', value: guaranteeFailureTypeId, type: 'string', required: true },
  ]);

  try {
    const failureType = await deleteGuaranteeFailureTypes<GuaranteeFailureType>({
      data: {
        where: {
          id: guaranteeFailureTypeId,
        },
      },
    });

    return res.status(200).json({
      failureType,
      ServerMessage: {
        statusCode: 200,
        message: `Tipo de falha '${failureType?.name}' deletado com sucesso.`,
      },
    });
  } catch (error: any) {
    const message =
      error.code === 'P2003' ? 'Tipo de falha em uso' : 'Erro ao deletar tipo de falha';

    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message,
      },
    });
  }
}
