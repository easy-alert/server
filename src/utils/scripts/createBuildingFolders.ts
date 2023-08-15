import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

async function findManyBuildings() {
  return prisma.building.findMany({
    select: {
      id: true,
      name: true,
      Annexes: true,
    },
  });
}

export async function createBuildingFolders(_req: Request, res: Response) {
  const buildings = await findManyBuildings();
  const transactions: any = [];

  buildings.forEach((building) => {
    transactions.push(
      prisma.folders.create({
        data: {
          name: 'Início',
          Files: {
            createMany: {
              data: building.Annexes.map((annex) => ({
                name: annex.name,
                url: annex.url,
              })),
            },
          },
          BuildingFolders: {
            create: {
              buildingId: building.id,
            },
          },
        },
      }),
    );
  });

  await prisma.$transaction(transactions);

  return res.status(200).json({
    ServerMessage: {
      message: 'ok',
    },
  });
}
