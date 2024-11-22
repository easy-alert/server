import { prisma } from '../../../../../prisma';

export async function findManyMaintenancePriority() {
  const maintenancePriority = await prisma.maintenancePriority.findMany();

  return { maintenancePriority };
}
