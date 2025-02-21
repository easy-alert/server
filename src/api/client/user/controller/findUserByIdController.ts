import { Request, Response } from 'express';

import { findUserById } from '../services/findUserById';

export async function findUserByIdController(req: Request, res: Response) {
  const { userId } = req.params as { userId: string };

  const user = await findUserById({ userId });

  return res.status(200).json({ user });
}
