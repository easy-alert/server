// PRISMA
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { prisma } from '../../../../../../prisma';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';

// TYPES
import { ICheckPermission } from './types';

const validator = new Validator();

export class PermissionServices {
  async findByName({ name }: { name: string }) {
    const permission = await prisma.permission.findUnique({
      where: { name },
    });

    validator.needExist([{ label: 'permissão', variable: permission }]);

    return permission;
  }

  async checkPermission({ UserPermissions, permissions }: ICheckPermission) {
    let isPermitted = false;

    for (const permission of permissions) {
      if (UserPermissions.some((userPermission) => userPermission.Permission.name === permission)) {
        isPermitted = true;
        break;
      }
    }

    if (!isPermitted) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você não possui permissão de acesso.',
      });
    }
  }

  async getAllPermissions({ adminPermissions }: { adminPermissions: boolean }) {
    if (adminPermissions) {
      return prisma.permission.findMany({
        select: {
          id: true,
          name: true,
          moduleName: true,
          label: true,
          moduleLabel: true,
        },

        orderBy: {
          moduleName: 'asc',
        },
      });
    }

    return prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        moduleName: true,
        label: true,
        moduleLabel: true,
      },

      orderBy: {
        moduleName: 'asc',
      },

      where: {
        moduleName: {
          not: 'admin',
        },
      },
    });
  }
}
