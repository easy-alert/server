import { prisma } from '../../../../../prisma';

interface IFindUserCompanyOwner {
  companyId: string;
}

export async function findCompanyOwner({ companyId }: IFindUserCompanyOwner) {
  const companyUser = await prisma.company.findFirst({
    select: {
      UserCompanies: {
        select: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              emailIsConfirmed: true,
            },
          },
        },
      },
    },

    where: {
      id: companyId,

      UserCompanies: {
        some: {
          companyId,
          owner: true,
        },
      },
    },
  });

  const companyOwner = companyUser?.UserCompanies[0]?.User;

  if (!companyOwner) {
    throw new Error('Dono da empresa não encontrado');
  }

  return companyOwner;
}
