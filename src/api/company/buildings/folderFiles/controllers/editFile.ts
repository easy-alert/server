import { Request, Response } from 'express';
import { validator } from '../../../../../utils/validator/validator';
import { filesServices } from '../services/filesServices';

export async function editFileController(req: Request, res: Response) {
  const { name, fileId } = req.body;

  validator.check([
    {
      label: 'ID do arquivo',
      variable: fileId,
      type: 'string',
    },
    {
      label: 'Nome do arquivo',
      variable: name,
      type: 'string',
    },
  ]);

  await filesServices.findById(fileId);

  const folder = await filesServices.edit({ fileId, name });

  return res.status(200).json(folder);
}
