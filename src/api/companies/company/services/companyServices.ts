import { prisma } from '../../../../utils/prismaClient';
import { ICreateCompany, IEditCompany, IListCompany } from '../types';

export class CompanyServices {
  async create({ name, CNPJ, CPF, contactNumber, image }: ICreateCompany) {
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

  async edit({
    name,
    CNPJ,
    CPF,
    contactNumber,
    image,
    companyId,
  }: IEditCompany) {
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

  async createUserCompany({
    userId,
    companyId,
  }: {
    userId: string;
    companyId: string;
  }) {
    return prisma.userCompanies.create({
      data: {
        companyId,
        userId,
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

  async list({ take = 20, page, search = '' }: IListCompany) {
    const users = await prisma.company.findMany({
      take,
      skip: (page - 1) * take,

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

    const companiesCount = await prisma.user.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return { users, companiesCount };
  }
}
