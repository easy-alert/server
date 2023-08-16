import { Request, Response } from 'express';
import { folderServices } from '../services/folderServices';
import { validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

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

  const folderData = await folderServices.findById(folderId);

  if (folderData?.Parent?.id) {
    const parent = await folderServices.findById(folderData?.Parent?.id);
    const folderFound = parent?.Folders.some((folder) => folder.name === name.trim());

    if (folderFound || (!parent?.Parent?.id && parent?.name === name.trim())) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Este nível já possui uma pasta com esse nome.',
      });
    }
  }
  const folder = await folderServices.edit({ folderId, name });

  return res.status(200).json(folder);
}
