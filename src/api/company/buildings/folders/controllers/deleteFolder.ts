import { Request, Response } from 'express';
import { folderServices } from '../services/folderServices';
import { validator } from '../../../../../utils/validator/validator';

export async function deleteFolderController(req: Request, res: Response) {
  const { folderId } = req.params;

  validator.check([
    {
      label: 'ID da pasta',
      variable: folderId,
      type: 'string',
    },
  ]);

  await folderServices.findById(folderId);

  await folderServices.delete(folderId);

  return res.status(200).json({
    ServerMessage: {
      message: 'Pasta excluída com sucesso!',
    },
  });
}
