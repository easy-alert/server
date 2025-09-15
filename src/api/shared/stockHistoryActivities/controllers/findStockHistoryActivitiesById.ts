import { Response, Request } from 'express';

import { findManyStockHistoryActivities } from '../services/findManyStockHistoryActivities';

import { checkValues } from '../../../../utils/newValidator';

export async function findStockHistoryActivitiesById(req: Request, res: Response) {
  const { stockId } = req.params as any as { stockId: string };

  checkValues([{ label: 'ID do estoque', type: 'string', value: stockId }]);

  const { stockActivities } = await findManyStockHistoryActivities(stockId);

  return res.status(200).json({ stockActivities });
}
