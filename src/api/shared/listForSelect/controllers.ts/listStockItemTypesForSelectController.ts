import { Request, Response } from 'express';

import { listStockItemTypes } from '../services/listStockItemTypes';

import { checkValues } from '../../../../utils/newValidator';

export async function listStockItemTypesForSelectController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId } = req.query as unknown as { buildingId: string | undefined };

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stockItemTypes = await listStockItemTypes({
    companyId,
    buildingId,
  });

  res.status(200).json({ stockItemTypes });
}
