import type { GuaranteeFailureType } from '@prisma/client';
import type { Request, Response } from 'express';

import { updateGuaranteeFailureTypes } from '../services/updateGuaranteeFailureTypes';

import { checkValues } from '../../../../../utils/newValidator';

interface IQuery {
  guaranteeFailureTypeId: string;
}

interface IBody {
  companyId: string;
  failureTypeName: string;
}

export async function putGuaranteeFailureTypesController(req: Request, res: Response) {
  const { guaranteeFailureTypeId } = req.params as unknown as IQuery;
  const { companyId, failureTypeName } = req.body as unknown as IBody;

  checkValues([
    { label: 'ID do tipo de falha', value: guaranteeFailureTypeId, type: 'string', required: true },
    { label: 'Nome do tipo de falha', value: failureTypeName, type: 'string', required: true },
  ]);

  const failureTypesUpdated = await updateGuaranteeFailureTypes<GuaranteeFailureType>({
    data: {
      data: {
        name: failureTypeName,
        companyId,
      },

      where: {
        id: guaranteeFailureTypeId,
      },
    },
  });

  return res.status(200).json({
    failureTypesUpdated,
    ServerMessage: {
      statusCode: 200,
      message: 'Tipo de falha atualizado com sucesso.',
    },
  });
}
