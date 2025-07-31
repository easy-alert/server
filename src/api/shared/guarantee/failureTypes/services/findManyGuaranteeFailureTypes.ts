import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindManyGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeFindManyArgs;
}

export async function findManyGuaranteeFailureTypes<T>({
  data,
}: IFindManyGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.findMany(data) as Promise<T | null>;
}
