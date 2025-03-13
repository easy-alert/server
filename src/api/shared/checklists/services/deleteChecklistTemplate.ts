import { prisma } from '../../../../../prisma';

export async function deleteChecklistTemplate({
  checklistTemplateId,
}: {
  checklistTemplateId: string;
}) {
  await prisma.checklistTemplate.delete({
    where: {
      id: checklistTemplateId,
    },
  });
}
