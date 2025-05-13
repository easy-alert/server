import { prisma } from '../../../../../prisma';

interface IGetChecklistsTemplatesById {
  checklistTemplateId: string;
}

export async function getChecklistsTemplatesById({
  checklistTemplateId,
}: IGetChecklistsTemplatesById) {
  const checklistTemplates = await prisma.checklistTemplate.findMany({
    include: {
      items: true,
    },

    where: {
      id: checklistTemplateId,
    },
  });

  return checklistTemplates;
}
