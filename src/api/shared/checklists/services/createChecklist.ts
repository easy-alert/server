import type {
  Checklist,
  ChecklistItem,
  ChecklistStatusName,
  ChecklistTemplate,
  ChecklistTemplateItem,
} from '@prisma/client';

import { prisma } from '../../../../../prisma';

interface ICreateChecklist {
  buildingId: string;
  newChecklist?: Checklist & { items: ChecklistItem[] };
  checklistTemplate?: ChecklistTemplate & { items: ChecklistTemplateItem[] };
  responsibleId: string;
  startDate: Date;
  interval: number;
  status: ChecklistStatusName;
}

export async function createChecklist({
  buildingId,
  newChecklist,
  checklistTemplate,
  responsibleId,
  startDate,
  interval,
  status,
}: ICreateChecklist) {
  let building = null;

  if (buildingId.length === 12) {
    building = await prisma.building.findUnique({
      where: {
        nanoId: buildingId,
      },
    });
  } else {
    building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });
  }

  if (!building) {
    throw new Error('Edificação não encontrada.');
  }

  const selectedChecklist =
    newChecklist || (checklistTemplate as ChecklistTemplate & { items: ChecklistTemplateItem[] });

  const createdChecklist = await prisma.checklist.create({
    data: {
      buildingId: building.id,
      userId: responsibleId,
      templateId: selectedChecklist?.id,

      name: selectedChecklist?.name || `Checklist - ${new Date().toLocaleDateString()}`,
      description: selectedChecklist?.description,
      date: startDate,
      frequency: interval,
      status,

      checklistItem: {
        createMany: {
          data: selectedChecklist.items.map((item) => ({
            name: item.name,
            status: 'pending',
          })),
        },
      },
    },
  });

  return createdChecklist;
}
