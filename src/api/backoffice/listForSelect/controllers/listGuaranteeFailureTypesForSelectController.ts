import type { Request, Response } from 'express';

import { listGuaranteeFailureTypesForSelect } from '../../../shared/listForSelect/services/listGuaranteeFailureTypesForSelect';

export async function listGuaranteeFailureTypesForSelectController(req: Request, res: Response) {
  const { companyId, getDefault } = req.query as { companyId: string; getDefault: string };

  const companyIdFormatted = companyId || req?.Company?.id;
  let defaultFailureTypes: { id: string; name: string }[] = [];

  if (getDefault === 'true') {
    defaultFailureTypes = await listGuaranteeFailureTypesForSelect({
      companyId: undefined,
      failureTypesIds: undefined,
    });
  }

  const failureTypes = await listGuaranteeFailureTypesForSelect({
    companyId: companyIdFormatted,
    failureTypesIds: undefined,
  });

  const failureTypesToSelect = [...defaultFailureTypes, ...failureTypes].filter(
    (failureType, index, self) => index === self.findIndex((ft) => ft.id === failureType.id),
  );

  return res.status(200).json({ failureTypes: failureTypesToSelect });
}
