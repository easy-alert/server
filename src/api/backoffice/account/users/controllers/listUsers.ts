// TYPES
import { Request, Response } from 'express';

// CLASS
import { userServices } from '../services/userServices';

export async function listUsers(req: Request, res: Response) {
  const { page, search } = req.query as { page: string; search: string };

  const pagination = page ?? 1;

  const Companies = await userServices.list({
    page: Number(pagination),
    search: search as string,
  });

  return res.status(200).json(Companies);
}
