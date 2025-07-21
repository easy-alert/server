import { prisma } from '../../../../../../prisma';

import { UserServices } from '../../../../shared/users/user/services/userServices';

import { ICreateCompany, IListCompany } from './types';
import { SharedCompanyServices } from '../../../../shared/users/accounts/services/sharedCompanyServices';
import { Validator } from '../../../../../utils/validator/validator';

const userServices = new UserServices();
const sharedCompanyServices = new SharedCompanyServices();
const validator = new Validator();
export class CompanyServices {
  // #region create

  async create({
    name,
    CNPJ = null,
    CPF = null,
    contactNumber,
    image,
    isNotifyingOnceAWeek,
    canAccessChecklists,
    canAccessTickets,
  }: ICreateCompany) {
    const companyData = {
      name,
      CNPJ,
      CPF,
      contactNumber,
      image,
      isNotifyingOnceAWeek,
      canAccessChecklists,
      canAccessTickets,
    };

    if (CPF) {
      return prisma.company.upsert({
        create: companyData,
        update: companyData,
        where: {
          CPF,
        },
      });
    }

    if (CNPJ) {
      return prisma.company.upsert({
        create: companyData,
        update: companyData,
        where: {
          CNPJ,
        },
      });
    }

    return prisma.company.create({
      data: {
        name,
        CNPJ,
        CPF,
        contactNumber,
        image,
        isNotifyingOnceAWeek,
        canAccessChecklists,
        canAccessTickets,
      },
    });
  }

  async createUserCompany({
    userId,
    companyId,
    owner = false,
  }: {
    userId: string;
    companyId: string;
    owner?: boolean;
  }) {
    return prisma.userCompanies.upsert({
      create: {
        userId,
        companyId,
        owner,
      },
      update: {},
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
    });
  }
  // #endregion

  // #region edit

  async changeIsBlocked({ companyId }: { companyId: string }) {
    const company = await sharedCompanyServices.findById({ companyId });

    await prisma.$transaction([
      prisma.building.updateMany({
        where: {
          companyId,
        },

        data: {
          isBlocked: !company?.isBlocked,
        },
      }),

      prisma.company.update({
        data: {
          isBlocked: !company?.isBlocked,
        },
        where: { id: companyId },
      }),
    ]);
  }

  // #endregion

  async list({ take = 20, page, search = '' }: IListCompany) {
    const companiesAndOwners = await prisma.company.findMany({
      take,
      skip: (page - 1) * take,

      select: {
        id: true,
        image: true,
        name: true,
        contactNumber: true,
        CNPJ: true,
        CPF: true,
        isBlocked: true,
        createdAt: true,
        UserCompanies: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                lastAccess: true,
              },
            },
          },
          where: { owner: true },
        },
      },

      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const companiesCount = await prisma.company.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return { companiesAndOwners, companiesCount };
  }

  async delete({ companyId }: { companyId: string }) {
    const owner = await userServices.findOwner({ companyId });

    await userServices.delete({ userId: owner!.userId });

    await sharedCompanyServices.findById({ companyId });

    await prisma.company.delete({ where: { id: companyId } });
  }

  async findById({ companyId }: { companyId: string }) {
    const Company = await prisma.company.findFirst({
      include: {
        UserCompanies: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                lastAccess: true,
                isBlocked: true,
              },
            },

            owner: true,
          },
        },

        Buildings: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      where: {
        id: companyId,
      },
    });

    validator.needExist([
      {
        label: 'Empresa',
        variable: Company,
      },
    ]);

    return Company!;
  }
}

export const companyServices = new CompanyServices();
