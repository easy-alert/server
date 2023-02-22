// PRISMA
import { prisma } from '../../../../../../prisma';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class BuildingTypeServices {
  async list() {
    return prisma.buildingType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById({ buildingTypeId }: { buildingTypeId: string }) {
    const buildingType = await prisma.buildingType.findUnique({
      where: {
        id: buildingTypeId,
      },
    });

    validator.needExist([{ label: 'Tipo da edificação', variable: buildingType }]);

    return buildingType;
  }
}
