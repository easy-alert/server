import { prisma, prismaTypes } from '../../../../../../prisma';
import { validator } from '../../../../../utils/validator/validator';

export class FilesServices {
  async create(data: prismaTypes.FolderFilesCreateManyInput[]) {
    const files = await prisma.$transaction(
      data.map((file) => prisma.folderFiles.create({ data: file })),
    );

    return files;
  }

  async edit({ fileId, name }: { fileId: string; name: string }) {
    return prisma.folderFiles.update({
      data: {
        name,
      },
      where: {
        id: fileId,
      },
    });
  }

  async findById(id: string) {
    const file = await prisma.folderFiles.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        id,
      },
    });

    validator.needExist([
      {
        label: 'Arquivo',
        variable: file,
      },
    ]);

    return file;
  }

  async delete(id: string) {
    await this.findById(id);

    await prisma.folderFiles.delete({
      where: {
        id,
      },
    });
  }
}
export const filesServices = new FilesServices();
