import type { Request, Response } from 'express';

import { deletePlatformVideo } from '../services/deletePlatformVideo';

export async function deletePlatformVideoController(req: Request, res: Response) {
  const { id } = req.params;

  const deleteResponse = await deletePlatformVideo({
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
