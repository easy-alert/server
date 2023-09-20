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
  }: ICreateCompany) {
    return prisma.company.create({
      data: {
        name,
        CNPJ,
        CPF,
        contactNumber,
        image,
        isNotifyingOnceAWeek,
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
    return prisma.userCompanies.create({
      data: {
        companyId,
        userId,
        owner,
      },
    });
  }
  // #endregion

  // #region edit

  async changeIsBlocked({ companyId }: { companyId: string }) {
    const company = await sharedCompanyServices.findById({ companyId });

    await prisma.company.update({
      data: {
        isBlocked: !company?.isBlocked,
      },
      where: { id: companyId },
    });
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
                name: true,
                email: true,
                id: true,
                lastAccess: true,
              },
            },
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
