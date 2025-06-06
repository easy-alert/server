import { ChecklistItem, ChecklistStatusName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

interface ISaveChecklist {
  checklistId?: string;
  buildingId?: string;
  userId?: string;
  checklistItems?: ChecklistItem[];
  observation?: string;
  status?: ChecklistStatusName;
  finishedById?: string;

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
  checklistItems,
  observation,
  finishedById,
  status,
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
      observation,
      status,
      finishedById,

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
    },

    where: {
      id: checklistId,
    },
  });
}
