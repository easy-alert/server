import { prisma, prismaTypes } from '../../../../../prisma';

export async function deleteChecklistTemplate(args: prismaTypes.ChecklistDeleteManyArgs) {
  await prisma.checklistTemplate.deleteMany(args);
}
