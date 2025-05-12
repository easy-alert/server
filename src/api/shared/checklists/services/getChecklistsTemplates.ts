import { prisma } from '../../../../../prisma';

interface IGetChecklistsTemplates {
  companyId: string;
  buildingId?: string;
}

export async function getChecklistsTemplates({ companyId, buildingId }: IGetChecklistsTemplates) {
  const checklistTemplates = await prisma.checklistTemplate.findMany({
    include: {
      items: true,
    },

    where: {
      companyId,
      buildingId,
    },
  });

  return checklistTemplates;
}
