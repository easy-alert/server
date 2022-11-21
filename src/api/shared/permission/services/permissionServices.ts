// PRISMA
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { prisma } from '../../../../../prisma';

// CLASS
import { Validator } from '../../../../utils/validator/validator';

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

  async checkPermission({ UserPermissions, permission }: ICheckPermission) {
    let isPermited = false;

    for (const element of UserPermissions) {
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
