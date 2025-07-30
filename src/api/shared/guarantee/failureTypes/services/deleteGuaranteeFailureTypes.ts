import { prisma, prismaTypes } from '../../../../../../prisma';

interface IDeleteGuaranteeFailureTypes {
  data: prismaTypes.GuaranteeFailureTypeDeleteArgs;
}

export async function deleteGuaranteeFailureTypes<T>({
  data,
}: IDeleteGuaranteeFailureTypes): Promise<T | null> {
  return prisma.guaranteeFailureType.delete(data) as unknown as Promise<T | null>;
}
