import { ICreateAnnexe } from './types';

import { prisma } from '../../../../../../prisma';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class BuildingAnnexeServices {
  async create({ data }: ICreateAnnexe) {
    return prisma.buildingAnnexe.create({
      data,
    });
  }

  async findById({ annexeId }: { annexeId: string }) {
    const annexe = await prisma.buildingAnnexe.findUnique({
      where: {
        id: annexeId,
      },
    });

    validator.needExist([{ label: 'Anexo', variable: annexe }]);

    return annexe;
  }

  async delete({ annexeId }: { annexeId: string }) {
    await prisma.buildingAnnexe.delete({
      where: {
        id: annexeId,
      },
    });
  }
}
