import type { StockItem } from '@prisma/client';
import type { Request, Response } from 'express';

import { updateStockItem } from '../services/updateStockItem';
import { findFirstStockItem } from '../services/findFirstStockItem';

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

interface StockItemExists {
  id: string;
  name: string;
}

export async function putStockItemController(req: Request, res: Response) {
  const { companyId } = req;
  const {
    id: stockItemId,
    buildingId,
    name,
    description,
    unit,
    isActive,
    stockItemTypeId,
  } = req.body as StockItem;

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'ID do item', type: 'string', value: stockItemId, required: true },
    { label: 'Nome', type: 'string', value: name, required: true },
    { label: 'Descrição', type: 'string', value: description, required: false },
    { label: 'Ativo', type: 'boolean', value: isActive, required: false },
    { label: 'ID da edificação', type: 'string', value: buildingId, required: false },
    { label: 'ID do tipo de item', type: 'string', value: stockItemTypeId, required: true },
  ]);

  const existsStockItem = await findFirstStockItem<StockItemExists>({
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

  if (existsStockItem && existsStockItem.id !== stockItemId) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: `Item '${existsStockItem.name}' já cadastrado.`,
      },
    });
  }

  const stockItem = await updateStockItem<StockItemOutput>({
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

      where: {
        id: stockItemId,
      },
    },
  });

  if (!stockItem) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao editar item.',
      },
    });
  }

  return res.status(201).json({
    stockItem,
    ServerMessage: {
      statusCode: 201,
      message: `Item '${stockItem.name}' editado com sucesso.`,
    },
  });
}
