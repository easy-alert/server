import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateUserPermissions {
  data: prismaTypes.UserPermissionsCreateArgs;
}

export async function createUserPermissions<T>({ data }: ICreateUserPermissions): Promise<T | null> {
  const result = await prisma.userPermissions.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
