import type { Request, Response } from 'express';
import { findManyBuildings } from '../services/findManyBuildings';

export async function listBuildings(req: Request, res: Response) {
  const { page, search } = req.query;

  const pagination = page ?? 1;

  const { buildings, totalBuildings } = await findManyBuildings({
    page: Number(pagination),
    search: search as string,
    take: 20,
  });

  return res.status(200).json({
    buildings,
    totalBuildings,
  });
}
