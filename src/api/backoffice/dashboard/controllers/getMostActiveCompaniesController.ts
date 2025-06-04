/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

export async function getMostActiveCompaniesController(req: Request, res: Response) {
  const { take } = req.query;

  const companies = await dashboardServices.rankingMostActiveCompanies();

  companies.sort((a, b) => b._count.MaintenancesHistory - a._count.MaintenancesHistory);

  if (take && companies.length > Number(take)) {
    companies.splice(Number(take));
  }

  return res.status(200).json({ companies });
}
