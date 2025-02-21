import { prisma } from '../../../../../prisma';

interface IGetChecklists {
  companyId: string;
  checklistId: string;
}

export async function getChecklists({ companyId, checklistId }: IGetChecklists) {
  const checklistTemplates = await prisma.checklist.findMany({
    include: {
      checklistItem: true,
      user: true,
      images: true,
    },

    where: {
      id: checklistId,

      building: {
        companyId,
      },
    },
  });

  return checklistTemplates;
}
