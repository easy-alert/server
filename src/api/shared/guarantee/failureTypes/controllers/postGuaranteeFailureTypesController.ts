import type { GuaranteeFailureType } from '@prisma/client';
import type { Request, Response } from 'express';

import { createGuaranteeFailureTypes } from '../services/createGuaranteeFailureTypes';
import { findFirstGuaranteeFailureTypes } from '../services/findFirstGuaranteeFailureTypes';

interface IBody {
  companyId: string;
  failureTypes: string | string[];
}

export async function postGuaranteeFailureTypesController(req: Request, res: Response) {
  const { companyId, failureTypes } = req.body as unknown as IBody;

  if (typeof failureTypes === 'string') {
    const failureTypeExists = await findFirstGuaranteeFailureTypes<GuaranteeFailureType>({
      data: {
        where: {
          name: failureTypes,
          companyId,
        },
      },
    });

    if (failureTypeExists) {
      return res.status(400).json({
        ServerMessage: {
          statusCode: 400,
          message: 'Tipo de falha já cadastrado.',
        },
      });
    }

    const failureTypesCreated = await createGuaranteeFailureTypes<GuaranteeFailureType>({
      data: {
        data: {
          name: failureTypes,
          companyId,
        },
      },
    });

    return res.status(200).json({
      failureTypesCreated,
      ServerMessage: {
        statusCode: 200,
        message: 'Tipo de falha cadastrado com sucesso.',
      },
    });
  }

  try {
    const failureTypesCreated = await Promise.all(
      failureTypes.map(async (failureType) => {
        const failureTypeExists = await findFirstGuaranteeFailureTypes<GuaranteeFailureType>({
          data: {
            where: {
              name: failureType,
              companyId,
            },
          },
        });

        if (failureTypeExists) {
          throw new Error(`Tipo de falha '${failureType}' já cadastrado.`);
        }

        return createGuaranteeFailureTypes<GuaranteeFailureType>({
          data: {
            data: {
              name: failureType,
              companyId,
            },
          },
        });
      }),
    );

    return res.status(200).json({
      failureTypesCreated,
      ServerMessage: {
        statusCode: 200,
        message: 'Tipos de falha cadastrados com sucesso.',
      },
    });
  } catch (error) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: error instanceof Error ? error.message : 'Erro ao cadastrar tipos de falha',
      },
    });
  }
}
