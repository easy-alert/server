// PRISMA
import { ServerMessage } from '../../../utils/messages/serverMessage';
import { prisma } from '../../../utils/prismaClient';

// TYPES
import { ICheckPermission } from '../types';

export class PermissionServices {
  async list() {
    return prisma.permission.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findByName({ name }: { name: string }) {
    return prisma.permission.findUnique({
      where: { name },
    });
  }

  async checkPermission({ userPermissions, permission }: ICheckPermission) {
    let isPermited = false;

    for (const element of userPermissions) {
      if (element.Permission.name === permission) isPermited = true;
    }

    if (!isPermited) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você não possui permissão de acesso.',
      });
    }
  }
}
