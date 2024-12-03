import { Request, Response } from 'express';

import { findManyTutorials } from '../services/findManyTutorials';

export async function getTutorials(req: Request, res: Response) {
  const { type } = req.body;

  const formattedType = type ?? undefined;

  const tutorials = await findManyTutorials({ type: formattedType });

  return res.status(200).json({
    tutorials,
  });
}
