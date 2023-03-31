import { prisma } from '../../../../../../prisma';
import { Validator } from '../../../../../utils/validator/validator';
import { IEditCompany } from './types';

const validator = new Validator();

export class SharedCompanyServices {
  // #region edit
  async edit({ name, CNPJ, CPF, contactNumber, image, companyId }: IEditCompany) {
    await this.findById({ companyId });

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

  // #region find
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
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    validator.needExist([{ label: 'empresa', variable: company }]);

    return company!;
  }
  // #endregion
}
