import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindUniqueCompanyData {
  data: prismaTypes.CompanyFindUniqueArgs;
}

export async function findUniqueCompanyData<T>({
  data,
}: IFindUniqueCompanyData): Promise<T | null> {
  return prisma.company.findUnique(data) as Promise<T | null>;
}
