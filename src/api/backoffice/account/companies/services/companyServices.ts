import { prisma } from '../../../../../../prisma';

import { UserServices } from '../../../../shared/users/user/services/userServices';

import { ICreateCompany, IListCompany } from './types';
import { SharedCompanyServices } from '../../../../shared/users/accounts/services/sharedCompanyServices';
import { Validator } from '../../../../../utils/validator/validator';

const userServices = new UserServices();
const sharedCompanyServices = new SharedCompanyServices();
const validator = new Validator();

export enum MaintenanceFlagColor {
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red',
  Gray = 'gray',
}

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
    clientType,
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
      clientType,
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
        clientType,
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
        clientType: true,
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
        MaintenancesHistory: {
          select: {
            resolutionDate: true,
          },
          where: {
            resolutionDate: { not: null },
          },
          orderBy: {
            resolutionDate: 'desc',
          },
          take: 1,
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

    const now = new Date();
    const companiesWithFlag = companiesAndOwners.map((company) => {
      const lastMaintenance = company.MaintenancesHistory?.[0]?.resolutionDate;
      let maintenanceFlag: MaintenanceFlagColor = MaintenanceFlagColor.Green;
      if (!lastMaintenance) {
        maintenanceFlag = MaintenanceFlagColor.Gray;
      } else {
        const diffMonths =
          (now.getTime() - new Date(lastMaintenance).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (diffMonths > 3) maintenanceFlag = MaintenanceFlagColor.Red;
        else if (diffMonths > 1) maintenanceFlag = MaintenanceFlagColor.Yellow;
      }
      return {
        ...company,
        maintenanceFlag,
      };
    });

    const companiesCount = await prisma.company.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return { companiesAndOwners: companiesWithFlag, companiesCount };
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
                image: true,
              },
            },

            owner: true,
          },
        },

        Buildings: {
          select: {
            id: true,
            name: true,
            isBlocked: true,
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
