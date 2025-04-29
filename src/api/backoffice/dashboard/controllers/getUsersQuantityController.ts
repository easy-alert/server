import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

export async function getUsersQuantityController(req: Request, res: Response) {
  const { status } = req.query;

  const usersCount = await dashboardServices.countUsers({
    userStatus: status === undefined ? undefined : status === 'blocked',
  });

  return res.status(200).json({ usersCount });
}
