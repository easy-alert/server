import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeCreateArgs;
}

export async function createGuaranteeFailureTypes<T>({
  data,
}: ICreateGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.create(data) as unknown as Promise<T | null>;
}
