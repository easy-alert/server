import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

class ChecklistServices {
  async createChecklistService(args: prismaTypes.ChecklistCreateArgs) {
    await prisma.checklist.create(args);
  }

  async updateChecklistService(args: prismaTypes.ChecklistUpdateArgs) {
    await prisma.checklist.update(args);
  }

  async findById(id: string) {
    const checklist = await prisma.checklist.findFirst({
      where: { id, building: { Company: { canAccessChecklists: true } } },
    });

    validator.needExist([{ label: 'Checklist', variable: checklist }]);

    return checklist!;
  }

  async delete(id: string) {
    await this.findById(id);

    return prisma.checklist.delete({ where: { id } });
  }

  async findMany({ buildingId }: { buildingId: string }) {
    return prisma.checklist.findMany({
      where: {
        buildingId,
        building: {
          Company: {
            canAccessChecklists: true,
          },
        },
      },
    });
  }
}

export const checklistServices = new ChecklistServices();
