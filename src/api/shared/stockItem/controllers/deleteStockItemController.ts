import type { Request, Response } from 'express';

import { deleteStockItem } from '../services/deleteStockItem';

import { checkValues } from '../../../../utils/newValidator';

export async function deleteStockItemController(req: Request, res: Response) {
  const { stockItemId } = req.params;

  checkValues([{ label: 'ID do item', type: 'string', value: stockItemId, required: true }]);

  const stockItem = await deleteStockItem<{ id: string; name: string }>({
    data: {
      select: {
        id: true,
        name: true,
      },

      where: {
        id: stockItemId,
      },
    },
  });

  if (!stockItem) {
    return res.status(404).json({
      ServerMessage: { message: 'Item não encontrado' },
    });
  }

  return res.status(200).json({
    stockItem,
    ServerMessage: { message: `Item ${stockItem.name} foi deletado com sucesso!` },
  });
}
