import { prisma, prismaTypes } from '../../../../../prisma';

interface IAggregateCompanyData {
  data: prismaTypes.CompanyAggregateArgs;
}

export async function aggregateCompanyData<T>({ data }: IAggregateCompanyData): Promise<T | null> {
  return prisma.company.aggregate(data) as Promise<T | null>;
}
