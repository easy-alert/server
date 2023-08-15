import { Request, Response } from 'express';
import { validator } from '../../../../utils/validator/validator';
import { folderServices } from '../../../company/buildings/folders/services/folderServices';

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
