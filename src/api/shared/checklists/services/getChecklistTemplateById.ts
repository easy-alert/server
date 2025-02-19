import { prisma } from '../../../../../prisma';

interface IGetChecklistTemplate {
  checklistId: string;
}

export async function getChecklistTemplateById({ checklistId }: IGetChecklistTemplate) {
  const checklistTemplates = await prisma.checklistTemplate.findUnique({
    include: {
      items: true,
    },

    where: {
      id: checklistId,
    },
  });

  return checklistTemplates;
}
