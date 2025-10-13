import { Request, Response } from 'express';

import { prisma } from '../../../../../prisma';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function createServiceType(req: Request, res: Response) {
  const { name } = req.body as { name?: string };

  checkValues([{ label: 'Nome do tipo', type: 'string', value: name }]);

  const base = String(name).trim();
  const singularLabel = base;
  const pluralLabel = base.endsWith('s') ? base : `${base}s`;

  try {
    const serviceType = await prisma.serviceType.create({
      data: {
        name: base,
        singularLabel,
        label: pluralLabel,
        pluralLabel,
        companyId: req.Company?.id ?? null,
      },
      select: {
        id: true,
        name: true,
        singularLabel: true,
        pluralLabel: true,
        companyId: true,
      },
    });

    return res.status(201).json({
      serviceType,
      ServerMessage: { statusCode: 201, message: 'Tipo de assistência criado com sucesso.' },
    });
  } catch (error: any) {
    throw new ServerMessage({ statusCode: 400, message: 'Não foi possível criar o tipo.' });
  }
}


