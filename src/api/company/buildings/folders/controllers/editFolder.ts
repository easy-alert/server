import { Request, Response } from 'express';
import { folderServices } from '../services/folderServices';
import { validator } from '../../../../../utils/validator/validator';

export async function editFolderController(req: Request, res: Response) {
  const { name, folderId } = req.body;

  validator.check([
    {
      label: 'ID da pasta',
      variable: folderId,
      type: 'string',
    },
    {
      label: 'Nome da pasta',
      variable: name,
      type: 'string',
    },
  ]);

  await folderServices.findById(folderId);

  const folder = await folderServices.edit({ folderId, name });

  return res.status(200).json(folder);
}
