import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

export async function getCompaniesQuantityController(req: Request, res: Response) {
  const { status } = req.query;

  const companiesCount = await dashboardServices.countCompanies({
    companyStatus: status === undefined ? undefined : status === 'blocked',
  });

  return res.status(200).json({ companiesCount });
}
