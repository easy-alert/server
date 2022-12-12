// TYPES
import { Request, Response } from 'express';

// CLASS
import { CompanyServices } from '../services/companyServices';

const companyServices = new CompanyServices();

export async function listCompanies(req: Request, res: Response) {
  const { page, search } = req.query;

  const pagination = page ?? 1;

  const Companies = await companyServices.list({
    page: Number(pagination),
    search: search as string,
  });

  return res.status(200).json(Companies);
}
