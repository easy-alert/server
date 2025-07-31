import type { Request, Response } from 'express';

import { listGuaranteeSystemsForSelect } from '../../../shared/listForSelect/services/listGuaranteeSystemsForSelect';

export async function listGuaranteeSystemsForSelectController(req: Request, res: Response) {
  const { companyId, getDefault } = req.query as { companyId: string; getDefault: string };

  const companyIdFormatted = companyId || req?.Company?.id;
  let defaultSystems: { id: string; name: string }[] = [];

  if (getDefault === 'true') {
    defaultSystems = await listGuaranteeSystemsForSelect({
      companyId: undefined,
      systemsIds: undefined,
    });
  }

  const systems = await listGuaranteeSystemsForSelect({
    companyId: companyIdFormatted,
    systemsIds: undefined,
  });

  const systemsToSelect = [...defaultSystems, ...systems].filter(
    (system, index, self) => index === self.findIndex((s) => s.id === system.id),
  );

  return res.status(200).json({ systems: systemsToSelect });
}
