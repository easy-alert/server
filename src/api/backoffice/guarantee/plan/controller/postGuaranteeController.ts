import type { Request, Response } from 'express';
import type { Guarantee } from '@prisma/client';

import { createGuarantee } from '../../../../shared/guarantee/plan/services/createGuarantee';
import { findFirstGuarantee } from '../../../../shared/guarantee/plan/services/findFirstGuarantee';

interface IBody {
  companyId: string;
  systemId: string;
  description: string;
  observation: string;
  failureTypesIds: string[];
  warrantyPeriod: number;
}

export async function postGuaranteeController(req: Request, res: Response) {
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

  if (guaranteeExists) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Garantia já cadastrada',
      },
    });
  }

  const guaranteeCreated = await createGuarantee<Guarantee>({
    data: {
      data: {
        companyId,
        systemId,
        description,
        observation,

        standardWarrantyPeriod: warrantyPeriod,

        guaranteeToFailureTypes: {
          connectOrCreate: failureTypesIds.map((failureTypesId) => ({
            where: { id: failureTypesId },
            create: {
              failureType: {
                connect: { id: failureTypesId },
              },
            },
          })),
        },
      },
    },
  });

  return res.status(201).json({
    guaranteeCreated,
    ServerMessage: {
      statusCode: 201,
      message: 'Garantia cadastrada com sucesso',
    },
  });
}
