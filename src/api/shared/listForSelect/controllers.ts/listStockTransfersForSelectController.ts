import { Request, Response } from 'express';

import { listStockTransfersForSelect } from '../services/listStockTransfersForSelect';

import { checkValues } from '../../../../utils/newValidator';

export async function listStockTransfersForSelectController(req: Request, res: Response) {
  const { companyId } = req;
  const { stockItemId } = req.query as unknown as {
    stockItemId: string;
  };

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'ID do item', type: 'string', value: stockItemId, required: true },
  ]);

  const stockTransfers = await listStockTransfersForSelect({
    companyId,
    stockItemId,
  });

  res.status(200).json({ stockTransfers });
}
