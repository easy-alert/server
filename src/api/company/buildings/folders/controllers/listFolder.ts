import { Request, Response } from 'express';
import { folderServices } from '../services/folderServices';
import { validator } from '../../../../../utils/validator/validator';

export async function listFolderController(req: Request, res: Response) {
  const { folderId } = req.params;

  validator.check([
    {
      label: 'ID da pasta',
      variable: folderId,
      type: 'string',
    },
  ]);

  const folder = await folderServices.findById(folderId);

  return res.status(200).json(folder);
}
