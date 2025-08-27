import type { Request, Response } from 'express';

import { deleteStockItemType } from '../services/deleteStockItemType';

import { checkValues } from '../../../../utils/newValidator';

export async function deleteStockItemTypeController(req: Request, res: Response) {
  const { stockItemTypeId } = req.params;

  checkValues([
    { label: 'ID do tipo de item', type: 'string', value: stockItemTypeId, required: true },
  ]);

  const stockItemType = await deleteStockItemType<{ id: string; name: string }>({
    data: {
      select: {
        id: true,
        name: true,
      },

      where: {
        id: stockItemTypeId,
      },
    },
  });

  if (!stockItemType) {
    return res.status(404).json({
      ServerMessage: { message: 'Tipo de item não encontrado' },
    });
  }

  return res.status(200).json({
    stockItemType,
    ServerMessage: { message: `Tipo de item ${stockItemType.name} foi deletado com sucesso!` },
  });
}
