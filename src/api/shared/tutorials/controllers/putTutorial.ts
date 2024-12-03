import { Request, Response } from 'express';
import { updateOneTutorial } from '../services/updateOneTutorial';

export async function putTutorial(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, url, thumbnail, type, order } = req.body;

  const updateResponse = await updateOneTutorial({
    id,
    title,
    description,
    url,
    thumbnail,
    type,
    order,
  });

  return res
    .status(200)
    .json({ updateResponse, ServerMessage: { message: 'Tutorial foi atualizado com sucesso!' } });
}
