import { prisma } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class SharedMaintenanceStatusServices {
  async findByName({ name }: { name: 'expired' | 'pending' | 'completed' | 'overdue' }) {
    const maintenance = await prisma.maintenancesStatus.findUnique({
      where: {
        name,
      },
    });

    validator.needExist([{ label: 'Status de manutenção', variable: maintenance }]);

    return maintenance!;
  }
}
