import { prisma } from '../../../../../prisma';

import { ICreateCompany } from './types';

export class CompanyUserServices {
  // #region create
  async create({ name, CNPJ = null, CPF = null, contactNumber, image }: ICreateCompany) {
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
  // #endregion
}
