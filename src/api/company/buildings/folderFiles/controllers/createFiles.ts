import { Request, Response } from 'express';
import { validator } from '../../../../../utils/validator/validator';
import { filesServices } from '../services/filesServices';
import { folderServices } from '../../folders/services/folderServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

interface IBody {
  files: {
    name: string;
    url: string;
    folderId: string;
  }[];
}

export async function createFilesController(req: Request, res: Response) {
  const { files }: IBody = req.body;

  if (!files) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Arquivos não informados.',
    });
  }

  for (let i = 0; i < files.length; i++) {
    await folderServices.findById(files[i].folderId);

    validator.check([
      {
        label: 'ID da pasta',
        variable: files[i].folderId,
        type: 'string',
      },
      {
        label: 'Nome do arquivo',
        variable: files[i].name,
        type: 'string',
      },
      {
        label: 'URL do arquivo',
        variable: files[i].url,
        type: 'string',
      },
    ]);
  }

  const filesData = await filesServices.create(files);

  return res.status(200).json(filesData);
}
