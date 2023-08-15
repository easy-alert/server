import { Request, Response } from 'express';
import { folderServices } from '../services/folderServices';
import { validator } from '../../../../../utils/validator/validator';
import { buildingServices } from '../../building/services/buildingServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

export async function createFolderController(req: Request, res: Response) {
  const { name, parentId, buildingId } = req.body;

  validator.check([
    {
      label: 'Nome da pasta',
      variable: name,
      type: 'string',
    },
    {
      label: 'ID do edificação',
      variable: buildingId,
      type: 'string',
    },
    {
      label: 'ID da pasta pai',
      variable: parentId,
      type: 'string',
      isOptional: true,
    },
  ]);

  await buildingServices.findById({ buildingId });

  if (parentId) {
    const folder = await folderServices.findById(parentId);

    const folderFound = folder?.Folders.some((folderData) => folderData.name === name.trim());

    if (folderFound || (!folder?.Parent?.id && folder?.name === name.trim())) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Este nível já possui uma pasta com esse nome.',
      });
    }
  }

  const folder = await folderServices.create({
    name,
    parentId,
    BuildingFolders: {
      create: { buildingId },
    },
  });

  return res.status(200).json(folder);
}
