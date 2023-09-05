import { Request, Response } from 'express';
import { filesServices } from '../services/filesServices';

export async function deleteFileController(req: Request, res: Response) {
  const { fileId } = req.params;

  await filesServices.delete(fileId);

  return res.status(200).json({
    ServerMessage: {
      message: 'Arquivo excluído com sucesso!',
    },
  });
}
