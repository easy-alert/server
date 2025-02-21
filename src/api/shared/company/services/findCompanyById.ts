import { prisma } from '../../../../../prisma';

interface IFindCompanyById {
  companyId: string;
}

export async function findCompanyById({ companyId }: IFindCompanyById) {
  return prisma.company.findFirst({
    where: {
      id: companyId,
    },
  });
}
