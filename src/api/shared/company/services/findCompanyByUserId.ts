import { prisma } from '../../../../../prisma';

interface IFindCompanyByUserId {
  userId: string;
}

export async function findCompanyByUserId({ userId }: IFindCompanyByUserId) {
  return prisma.company.findFirst({
    where: {
      UserCompanies: {
        some: {
          userId,
        },
      },
    },
  });
}
