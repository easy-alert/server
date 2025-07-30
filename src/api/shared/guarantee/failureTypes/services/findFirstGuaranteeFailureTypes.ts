import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindFirstGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeFindFirstArgs;
}

export async function findFirstGuaranteeFailureTypes<T>({
  data,
}: IFindFirstGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.findFirst(data) as Promise<T | null>;
}
