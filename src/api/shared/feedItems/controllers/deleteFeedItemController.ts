import type { Request, Response } from 'express';

import { deleteFeedItem } from '../services/deleteFeedItem';

export async function deleteFeedItemController(req: Request, res: Response) {
  const { id } = req.params;

  const deleteResponse = await deleteFeedItem({
    data: {
      where: {
        id,
      },
    },
  });

  return res
    .status(200)
    .json({ deleteResponse, ServerMessage: { message: 'Tutorial foi deletado com sucesso!' } });
}
