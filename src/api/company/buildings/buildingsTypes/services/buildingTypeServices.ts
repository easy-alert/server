// PRISMA
import { prisma } from '../../../../../utils/prismaClient';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class BuildingTypeServices {
  async list() {
    return prisma.buildingType.findMany({
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

    validator.needExist([{ label: 'Edificação', variable: buildingType }]);

    return buildingType;
  }
}
