import { Request, Response } from 'express';

import { listUsersForSelect } from '../../../shared/listForSelect/services/listUsersForSelect';
import { findCompanyByUserId } from '../../../shared/company/services/findCompanyByUserId';

export async function listUsersForSelectController(req: Request, res: Response) {
  const { userId, buildingId } = req.query as { userId: string; buildingId?: string };
  const { Company } = req;

  let companyId = Company?.id;

  if (!companyId && userId) {
    const company = await findCompanyByUserId({ userId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    companyId = company.id;
  }
  const users = await listUsersForSelect({ companyId, buildingId });

  return res.status(200).json({ users });
}
