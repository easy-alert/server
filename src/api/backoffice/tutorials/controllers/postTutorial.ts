import { Request, Response } from 'express';

import { createTutorial } from '../services/createTutorial';

export async function postTutorial(req: Request, res: Response) {
  const { title, description, url, thumbnail, type, order } = req.body;

  const createTutorialResponse = await createTutorial({
    title,
    description,
    url,
    thumbnail,
    type,
    order,
  });

  return res.status(201).json({
    createTutorialResponse,
    ServerMessage: {
      statusCode: 201,
      message: 'Tutorial cadastrado com sucesso.',
    },
  });
}
