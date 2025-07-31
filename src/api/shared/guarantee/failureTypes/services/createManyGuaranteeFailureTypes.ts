import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateManyGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeCreateManyArgs;
}

export async function createManyGuaranteeFailureTypes<T>({
  data,
}: ICreateManyGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.createMany(data) as Promise<T | null>;
}
