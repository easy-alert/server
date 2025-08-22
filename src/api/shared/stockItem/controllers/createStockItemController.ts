import type { StockItem } from '@prisma/client';
import type { Request, Response } from 'express';

import { createStockItem } from '../services/createStockItem';

import { checkValues } from '../../../../utils/newValidator';

interface StockItemOutput {
  id: string;
  name: string;
  description: string;
  unit: string;
  isActive: boolean;

  stockItemType: {
    id: string;
    name: string;
  };
}

export async function createStockItemController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId, name, description, unit, isActive, stockItemTypeId } = req.body as StockItem;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'Nome', type: 'string', value: name, required: true },
    { label: 'Descrição', type: 'string', value: description, required: false },
    { label: 'Ativo', type: 'boolean', value: isActive, required: false },
    { label: 'ID da edificação', type: 'string', value: buildingId, required: false },
    { label: 'ID do tipo de item', type: 'string', value: stockItemTypeId, required: true },
  ]);

  const stockItem = await createStockItem<StockItemOutput>({
    data: {
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        isActive: true,

        stockItemType: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      data: {
        name,
        description,
        unit,
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

        stockItemType: {
          connect: {
            id: stockItemTypeId,
          },
        },
      },
    },
  });

  if (!stockItem) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao cadastrar item.',
      },
    });
  }

  return res.status(201).json({
    stockItem,
    ServerMessage: {
      statusCode: 201,
      message: `Item '${stockItem.name}' cadastrado com sucesso.`,
    },
  });
}
