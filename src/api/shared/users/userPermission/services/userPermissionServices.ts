import { prisma } from '../../../../../../prisma';
import { ICreateUserPermission } from '../types';

export class UserPermissionServices {
  async createUserPermission({ userId, permissionId }: ICreateUserPermission) {
    await prisma.userPermissions.create({
      data: {
        userId,
        permissionId,
      },
    });
  }
}
