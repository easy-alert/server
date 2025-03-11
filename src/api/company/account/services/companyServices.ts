import { prisma } from '../../../../../prisma';

import { SharedCompanyServices } from '../../../shared/users/accounts/services/sharedCompanyServices';

import type { IEditCompany } from './types';

const sharedCompanyServices = new SharedCompanyServices();

export class CompanyServices {
  // #region edit
  async edit({
    companyId,
    name,
    CNPJ,
    CPF,
    contactNumber,
    image,
    showMaintenancePriority,
    ticketInfo,
    ticketType,
  }: IEditCompany) {
    await sharedCompanyServices.findById({ companyId });

    return prisma.company.update({
      data: {
        image,
        name,
        CNPJ,
        CPF,
        contactNumber,
        ticketInfo,
        ticketType,
        showMaintenancePriority,
      },
      where: { id: companyId },
    });
  }

  async findById({ companyId }: { companyId: string }) {
    return sharedCompanyServices.findById({ companyId });
  }

  // #endregion
}
