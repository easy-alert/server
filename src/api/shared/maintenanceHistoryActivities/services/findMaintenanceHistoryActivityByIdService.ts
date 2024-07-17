import { prisma } from '../../../../../prisma';
import { needExist } from '../../../../utils/newValidator';

export async function findMaintenanceHistoryActivityByIdService(id: string) {
  const maintenanceHistoryActivity = await prisma.maintenanceHistoryActivity.findUnique({
    where: { id },
  });

  needExist([{ label: 'Atividade', variable: maintenanceHistoryActivity }]);

  return maintenanceHistoryActivity!;
}
