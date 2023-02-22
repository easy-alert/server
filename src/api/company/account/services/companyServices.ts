import { prisma } from '../../../../../prisma';
import { SharedCompanyServices } from '../../../shared/users/accounts/services/sharedCompanyServices';

import { IEditCompany } from './types';

const sharedCompanyServices = new SharedCompanyServices();

export class CompanyServices {
  // #region edit
  async edit({ name, CNPJ, CPF, contactNumber, image, companyId }: IEditCompany) {
    await sharedCompanyServices.findById({ companyId });

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

  // #endregion
}
