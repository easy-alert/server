import { prisma, prismaTypes } from '../../../../../../prisma';

interface IDeleteGuaranteeToFailureTypes {
  data: prismaTypes.GuaranteeToFailureTypeDeleteArgs;
}

export async function deleteGuaranteeToFailureTypes<T>({
  data,
}: IDeleteGuaranteeToFailureTypes): Promise<T | null> {
  return prisma.guaranteeToFailureType.delete(data) as unknown as Promise<T | null>;
}
