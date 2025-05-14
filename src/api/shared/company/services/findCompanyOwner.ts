import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IFindUserCompanyOwner {
  companyId: string;
}

export async function findCompanyOwner({ companyId }: IFindUserCompanyOwner) {
  const companyUser = await prisma.userCompanies.findFirst({
    select: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          emailIsConfirmed: true,
          phoneNumber: true,
        },
      },
    },

    where: {
      companyId,
      owner: true,
    },
  });

  const companyOwner = companyUser?.User;

  if (!companyOwner) {
    throw new ServerMessage({
      statusCode: 404,
      message: 'Dono da empresa não encontrado',
    });
  }

  return companyOwner;
}
