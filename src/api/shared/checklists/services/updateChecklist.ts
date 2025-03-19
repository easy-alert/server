import { prisma, prismaTypes } from '../../../../../prisma';

export async function updateManyChecklist(args: prismaTypes.ChecklistUpdateManyArgs) {
  await prisma.checklist.updateMany(args);
}
