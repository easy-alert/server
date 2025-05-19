import type { ChecklistTemplateItem } from '@prisma/client';

import { prisma } from '../../../../../prisma';

interface UpdateChecklistTemplate {
  checklistTemplateId: string;
  companyId: string;
  buildingId: string;
  name: string;
  items: ChecklistTemplateItem[];
}

export async function updateChecklistTemplate({
  checklistTemplateId,
  companyId,
  buildingId,
  name,
  items,
}: UpdateChecklistTemplate) {
  const checklistTemplate = await prisma.checklistTemplate.findUnique({
    include: {
      items: true,
    },

    where: {
      id: checklistTemplateId,
    },
  });

  if (!checklistTemplate) {
    throw new Error('Modelo de checklist não encontrado.');
  }

  // Extract existing item IDs
  const existingItemIds = checklistTemplate.items.map((item) => item.id);

  // Extract updated item IDs
  const updatedItemIds = items.map((item) => item.id);

  // Find IDs to delete (existing IDs not in updated IDs)
  const idsToDelete = existingItemIds.filter((id) => !updatedItemIds.includes(id));

  const updatedChecklistTemplate = await prisma.$transaction(async () => {
    if (idsToDelete.length > 0) {
      await prisma.checklistTemplateItem.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      });
    }

    return prisma.checklistTemplate.update({
      where: {
        id: checklistTemplateId,
      },
      data: {
        name,
        companyId,
        buildingId,
        items: {
          upsert: items.map((item) => ({
            where: {
              id: item.id,
            },
            create: {
              name: item.name,
            },
            update: {
              name: item.name,
            },
          })),
        },
      },
    });
  });

  return updatedChecklistTemplate;
}
