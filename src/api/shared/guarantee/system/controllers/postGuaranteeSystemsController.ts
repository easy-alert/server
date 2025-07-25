import type { GuaranteeSystem } from '@prisma/client';
import type { Request, Response } from 'express';

import { createGuaranteeSystem } from '../services/createGuaranteeSystem';
import { createManyGuaranteeSystems } from '../services/createManyGuaranteeSystems';
import { findFirstGuaranteeSystem } from '../services/findFirstGuaranteeSystem';

interface IBody {
  companyId: string;
  systems: string | string[];
}

export async function postGuaranteeSystemsController(req: Request, res: Response) {
  const { companyId, systems } = req.body as unknown as IBody;

  if (typeof systems === 'string') {
    const systemExists = await findFirstGuaranteeSystem<GuaranteeSystem>({
      data: {
        where: {
          name: systems,
          companyId,
        },
      },
    });

    if (systemExists) {
      return res.status(400).json({
        ServerMessage: {
          statusCode: 400,
          message: 'Sistema já cadastrado.',
        },
      });
    }

    const systemsCreated = await createGuaranteeSystem<GuaranteeSystem>({
      data: {
        data: {
          name: systems,
          companyId,
        },
      },
    });

    return res.status(200).json({
      systemsCreated,
      ServerMessage: {
        statusCode: 200,
        message: 'Sistema cadastrado com sucesso.',
      },
    });
  }

  try {
    const systemsCreated = await Promise.all(
      systems.map(async (system) => {
        const systemExists = await findFirstGuaranteeSystem<GuaranteeSystem>({
          data: {
            where: {
              name: system,
              companyId,
            },
          },
        });

        if (systemExists) {
          throw new Error(`Sistema '${system}' já cadastrado.`);
        }

        return createManyGuaranteeSystems<GuaranteeSystem>({
          data: {
            data: {
              name: system,
              companyId,
            },
          },
        });
      }),
    );

    return res.status(200).json({
      systemsCreated,
      ServerMessage: {
        statusCode: 200,
        message: 'Sistemas cadastrados com sucesso.',
      },
    });
  } catch (error) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: error instanceof Error ? error.message : 'Erro ao cadastrar sistemas',
      },
    });
  }
}
