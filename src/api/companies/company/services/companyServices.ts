import { prisma } from '../../../../utils/prismaClient';
import { Validator } from '../../../../utils/validator/validator';
import { ICreateCompany, IEditCompany, IListCompany } from '../types';

const validator = new Validator();

export class CompanyServices {
  async create({
    name,
    CNPJ = null,
    CPF = null,
    contactNumber,
    image,
  }: ICreateCompany) {
    return prisma.company.create({
      data: {
        name,
        CNPJ,
        CPF,
        contactNumber,
        image,
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

  async findByCNPJ({ CNPJ }: { CNPJ: string }) {
    return prisma.company.findUnique({
      where: { CNPJ },
    });
  }

  async findByCPF({ CPF }: { CPF: string }) {
    return prisma.company.findUnique({
      where: { CPF },
    });
  }

  async findById({ companyId }: { companyId: string }) {
    return prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  async edit({
    name,
    CNPJ,
    CPF,
    contactNumber,
    image,
    companyId,
  }: IEditCompany) {
    const company = await this.findById({ companyId });
    validator.needExist([{ label: 'ID da empresa', variable: company }]);

    await prisma.company.update({
      data: {
        name,
        CNPJ,
        CPF,
        contactNumber,
        image,
      },
      where: { id: companyId },
    });
  }

  async delete({ companyId }: { companyId: string }) {
    const company = await this.findById({ companyId });
    validator.needExist([{ label: 'ID da empresa', variable: company }]);

    const owner = await prisma.userCompanies.findFirst({
      where: { companyId, owner: true },
    });
    await prisma.user.delete({ where: { id: owner?.userId } });

    await prisma.company.delete({ where: { id: companyId } });
  }

  async changeIsBlocked({ companyId }: { companyId: string }) {
    const company = await this.findById({ companyId });
    validator.needExist([{ label: 'ID da empresa', variable: company }]);

    await prisma.company.update({
      data: {
        isBlocked: !company?.isBlocked,
      },
      where: { id: companyId },
    });
  }

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
}
