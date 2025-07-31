import type { Request, Response } from 'express';
import type { Guarantee } from '@prisma/client';

import { updateGuarantee } from '../../../../shared/guarantee/plan/services/updateGuarantee';
import { findFirstGuarantee } from '../../../../shared/guarantee/plan/services/findFirstGuarantee';
import { deleteManyGuaranteeToFailureTypes } from '../../../../shared/guarantee/guaranteeToFailureTypes/services/deleteManyGuaranteeToFailureTypes';

interface IBody {
  companyId: string;
  systemId: string;
  description: string;
  observation: string;
  failureTypesIds: string[];
  warrantyPeriod: number;
}

export async function putGuaranteeController(req: Request, res: Response) {
  const { guaranteeId } = req.params;
  const { companyId, systemId, description, observation, failureTypesIds, warrantyPeriod } =
    req.body as unknown as IBody;

  const guaranteeExists = await findFirstGuarantee<Guarantee>({
    data: {
      where: {
        companyId,
        systemId,
        description,
        standardWarrantyPeriod: warrantyPeriod,
      },
    },
  });

  if (guaranteeExists && guaranteeExists.id !== guaranteeId) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Garantia já cadastrada',
      },
    });
  }

  await deleteManyGuaranteeToFailureTypes({
    data: {
      where: {
        guaranteeId,
      },
    },
  });

  const guaranteeUpdated = await updateGuarantee<Guarantee>({
    data: {
      data: {
        companyId,
        systemId,
        description,
        observation,

        standardWarrantyPeriod: warrantyPeriod,

        guaranteeToFailureTypes: {
          connectOrCreate: failureTypesIds.map((failureTypeId) => ({
            where: { id: failureTypeId },
            create: {
              failureType: {
                connect: { id: failureTypeId },
              },
            },
          })),
        },
      },

      where: {
        id: guaranteeId,
      },
    },
  });

  return res.status(201).json({
    guaranteeUpdated,
    ServerMessage: {
      statusCode: 201,
      message: 'Garantia atualizada com sucesso',
    },
  });
}
