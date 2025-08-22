import type { StockItemType } from '@prisma/client';
import type { Request, Response } from 'express';

import { createStockItemType } from '../services/createStockItemType';
import { findFirstStockItemType } from '../services/findFirstStockItemType';

import { checkValues } from '../../../../utils/newValidator';

interface StockItemTypeOutput {
  id: string;
  name: string;
  description: string;
  isActive: boolean;

  _count: {
    stockItems: number;
  };
}

interface StockItemTypeExists {
  id: string;
  name: string;
}

export async function createStockItemTypeController(req: Request, res: Response) {
  const { companyId } = req;
  const { name, description, buildingId, isActive } = req.body as StockItemType;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'Nome', type: 'string', value: name, required: true },
    { label: 'Descrição', type: 'string', value: description, required: false },
    { label: 'Ativo', type: 'boolean', value: isActive, required: false },
    { label: 'ID da edificação', type: 'string', value: buildingId, required: false },
  ]);

  const existsStockItemType = await findFirstStockItemType<StockItemTypeExists>({
    data: {
      select: {
        id: true,
        name: true,
      },

      where: {
        name,
        companyId,
        ...(buildingId && { buildingId }),
      },
    },
  });

  if (existsStockItemType) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: `Tipo de item '${existsStockItemType.name}' já cadastrado.`,
      },
    });
  }

  const stockItemType = await createStockItemType<StockItemTypeOutput>({
    data: {
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,

        _count: {
          select: {
            stockItems: true,
          },
        },
      },

      data: {
        name,
        description,
        isActive,

        company: {
          connect: {
            id: companyId,
          },
        },

        ...(buildingId && {
          building: {
            connect: {
              id: buildingId,
            },
          },
        }),
      },
    },
  });

  if (!stockItemType) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao cadastrar tipo de item.',
      },
    });
  }

  return res.status(201).json({
    stockItemType,
    ServerMessage: {
      statusCode: 201,
      message: `Tipo de item '${stockItemType.name}' cadastrado com sucesso.`,
    },
  });
}
