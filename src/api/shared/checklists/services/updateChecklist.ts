import { ChecklistItem, ChecklistStatusName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

interface IUpdateChecklist {
  checklistId: string;
  buildingId: string;
  status: ChecklistStatusName;
  checklistItems: ChecklistItem[];

  images:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

export async function updateChecklist({
  checklistId,
  status,
  checklistItems,
  images,
}: IUpdateChecklist) {
  await prisma.checklistImage.deleteMany({
    where: {
      checklistId,
    },
  });

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
        updateMany: checklistItems.map((checklistItem) => ({
          where: {
            id: checklistItem.id,
          },
          data: {
            status: checklistItem.status,
          },
        })),
      },
    },
    where: {
      id: checklistId,
    },
  });
}
