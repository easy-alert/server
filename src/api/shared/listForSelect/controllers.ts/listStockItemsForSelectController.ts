import { Request, Response } from 'express';

import { listStockItems } from '../services/listStockItems';

import { checkValues } from '../../../../utils/newValidator';

export async function listStockItemsForSelectController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId } = req.query as unknown as { buildingId: string | undefined };

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stockItems = await listStockItems({
    companyId,
    buildingId,
  });

  res.status(200).json({ stockItems });
}
