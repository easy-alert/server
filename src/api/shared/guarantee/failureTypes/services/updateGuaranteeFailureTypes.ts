import { prisma, prismaTypes } from '../../../../../../prisma';

interface IUpdateGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeUpdateArgs;
}

export async function updateGuaranteeFailureTypes<T>({
  data,
}: IUpdateGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.update(data) as unknown as Promise<T | null>;
}
