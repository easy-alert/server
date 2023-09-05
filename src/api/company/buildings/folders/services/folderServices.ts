import { prisma, prismaTypes } from '../../../../../../prisma';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { validator } from '../../../../../utils/validator/validator';

export class FolderServices {
  async create(data: prismaTypes.FoldersUncheckedCreateInput) {
    return prisma.folders.create({ data });
  }

  async edit({ folderId, name }: { folderId: string; name: string }) {
    return prisma.folders.update({
      data: {
        name,
      },
      where: {
        id: folderId,
      },
    });
  }

  async findById(id: string) {
    const folder = await prisma.folders.findFirst({
      select: {
        id: true,
        name: true,
        Folders: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
        Parent: {
          select: {
            id: true,
            name: true,
          },
        },
        Files: {
          select: {
            id: true,
            name: true,
            url: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      where: {
        id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    validator.needExist([
      {
        label: 'Pasta',
        variable: folder,
      },
    ]);

    return folder;
  }

  async delete(id: string) {
    const folder = await prisma.folders.findFirst({
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      where: {
        id,
      },
    });

    validator.needExist([
      {
        label: 'Pasta',
        variable: folder,
      },
    ]);

    if (!folder?.parentId) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Não é possível deletar uma pasta raiz.',
      });
    }

    await prisma.folders.delete({
      where: {
        id,
      },
    });
  }
}
export const folderServices = new FolderServices();
