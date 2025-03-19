import { ChecklistItem, ChecklistStatusName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

interface ISaveChecklist {
  checklistId?: string;
  buildingId?: string;
  userId?: string;
  status?: ChecklistStatusName;
  checklistItems?: ChecklistItem[];

  images?:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

export async function saveChecklist({
  checklistId,
  status,
  checklistItems,
  images,
}: ISaveChecklist) {
  if (images?.length) {
    await prisma.checklistImage.deleteMany({
      where: {
        checklistId,
      },
    });
  }

  await prisma.checklist.update({
    data: {
      status,
      images: images?.length
        ? {
            createMany: {
              data: images.map((image) => ({
                name: image.name,
                url: image.url,
              })),
            },
          }
        : undefined,

      checklistItem: {
        updateMany: checklistItems?.length
          ? checklistItems.map((checklistItem) => ({
              where: {
                id: checklistItem.id,
              },
              data: {
                status: checklistItem.status,
              },
            }))
          : undefined,
      },
    },

    where: {
      id: checklistId,
    },
  });
}
