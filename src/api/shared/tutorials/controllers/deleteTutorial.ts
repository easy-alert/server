import { Request, Response } from 'express';

import { deleteOneTutorial } from '../services/deleteOneTutorial';

export async function deleteTutorial(req: Request, res: Response) {
  const { id } = req.params;
  console.log('🚀 ~ deleteTutorial ~ id:', id);

  const deleteResponse = await deleteOneTutorial({ id });

  return res
    .status(200)
    .json({ deleteResponse, ServerMessage: { message: 'Tutorial foi deletado com sucesso!' } });
}
