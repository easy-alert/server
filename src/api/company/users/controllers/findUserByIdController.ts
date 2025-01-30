import { Request, Response } from 'express';

import { UserServices } from '../../../shared/users/user/services/userServices';

const userServices = new UserServices();

export async function findUserByIdController(req: Request, res: Response) {
  const { userId } = req.query;

  const user = await userServices.findById({ userId: userId as string });

  return res.status(200).json({ ...user });
}
