import { prisma, prismaTypes } from '../../../../../prisma';

export async function deleteChecklist(args: prismaTypes.ChecklistDeleteManyArgs) {
  await prisma.checklist.deleteMany(args);
}
