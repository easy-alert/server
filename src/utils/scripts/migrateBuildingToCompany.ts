import { Request, Response } from 'express';
import { prisma } from '../../../prisma';

export async function migrateBuildingToCompany(req: Request, res: Response) {
  const { buildingId, newCompanyId } = req.body;

  if (!buildingId || !newCompanyId) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: 'Parâmetros inválidos.',
      },
    });
  }

  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Edificação não encontrada.',
      },
    });
  }

  const categories = await prisma.category.findMany({
    where: { ownerCompanyId: building.companyId },
  });

  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];

    await prisma.category.create({
      data: {
        name: category.name,
        ownerCompanyId: newCompanyId,
        categoryTypeId: category.categoryTypeId,
      },
    });
  }

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Edificação migrada com sucesso.',
    },
  });

  // await prisma.building.update({
  //   data: { companyId: newCompanyId },
  //   where: { id: buildingId },
  // });

  // await prisma.buildingCategory.update({
  //   data: { categoryId: 'af4f08f9-e92c-46d6-81a9-0977c1dd4c2a' },
  //   where: { id: 'f4361c43-4da6-44dc-a64f-6da792ea42eb' },
  // });
  // console.log('2');
  // await prisma.buildingMaintenance.update({
  //   data: { maintenanceId: '5274243f-a213-4455-8ea3-2ea52aa07489' },
  //   where: { id: 'fd98eb1a-e776-4641-b6e4-140e6e5f5b06' },
  // });
  // console.log('3');
  // // trocar os maintenancesIds na maintenance history que eram da b2r e botar os novos do terrazas
  // const maintenanceHistoryIdsToUpdate = [
  //   '7dcadb52-ba8a-44dd-ab52-0f80bbd1c8a4',
  //   '9850384a-93ab-494c-b509-191cf306efc6',
  //   'de2bb54f-4a3e-400b-a004-5938b875fd17',
  //   '4533b5c1-e607-411c-b826-4cb5a1b9cea5',
  //   'cdf63be0-b21b-4500-a4f7-792cd5a6a7b2',
  //   'eff23169-8f87-4e9c-9fdf-f0a9247685d6',
  // ];
  // console.log('4');
  // for (let index = 0; index < maintenanceHistoryIdsToUpdate.length; index++) {
  //   const mhId = maintenanceHistoryIdsToUpdate[index];
  //   await prisma.maintenanceHistory.update({
  //     data: {
  //       maintenanceId: '5274243f-a213-4455-8ea3-2ea52aa07489',
  //     },
  //     where: { id: mhId },
  //   });
  // }
  // console.log('5');
  // await prisma.maintenanceHistory.updateMany({
  //   where: { buildingId: buildingTerrazasId },
  //   data: { ownerCompanyId: newTerrazasCompanyId },
  // });
  // console.log('ACABOUUUU');
}
