import { prisma } from '../../../../../prisma';

interface ICreateChecklistTemplate {
  companyId: string;
  buildingId: string;
  name: string;
  description?: string;
  items: {
    name: string;
  }[];
}

export async function createChecklistTemplate({
  companyId,
  buildingId,
  name,
  description,
  items,
}: ICreateChecklistTemplate) {
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

  const checklistTemplate = await prisma.checklistTemplate.create({
    data: {
      name,
      description,

      items: {
        create: items.map((item) => ({
          name: item.name,
        })),
      },

      company: {
        connect: {
          id: companyId,
        },
      },

      building: {
        connect: {
          id: building.id,
        },
      },
    },
  });

  return checklistTemplate;
}
