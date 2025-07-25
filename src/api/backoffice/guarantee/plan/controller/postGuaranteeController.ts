import type { Request, Response } from 'express';
import type { Guarantee } from '@prisma/client';

import { createGuarantee } from '../../../../shared/guarantee/plan/services/createGuarantee';

interface IBody {
  companyId: string;
  systemId: string;
  description: string;
  failureTypesIds: string[];
  warrantyPeriod: number;
}

export async function postGuaranteeController(req: Request, res: Response) {
  const { companyId, systemId, description, failureTypesIds, warrantyPeriod } =
    req.body as unknown as IBody;

  const guaranteeCreated = await createGuarantee<Guarantee>({
    data: {
      data: {
        companyId,
        systemId,
        description,
        standardWarrantyPeriod: warrantyPeriod,

        startDate: new Date(),
        endDate: new Date(),

        failureTypes: {
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
