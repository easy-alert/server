export async function migrateBuildingToOtherCompany() {
  // ESPECÍFICO PRA SITUAÇÃO DESSA MIGRAÇÃO, se for fazer outro, repensar tudo
  // ESPECÍFICO PRA SITUAÇÃO DESSA MIGRAÇÃO, se for fazer outro, repensar tudo
  // ESPECÍFICO PRA SITUAÇÃO DESSA MIGRAÇÃO, se for fazer outro, repensar tudo
  // ESPECÍFICO PRA SITUAÇÃO DESSA MIGRAÇÃO, se for fazer outro, repensar tudo
  // const buildingTerrazasId = '4cfdfd2b-7e7b-405f-bc6a-aa7535869b8a';
  // const newTerrazasCompanyId = '662ece18-4452-47f6-992c-1051e6d6bd50';
  // // trocar company id da edificação
  // await prisma.building.update({
  //   data: { companyId: newTerrazasCompanyId },
  //   where: { id: buildingTerrazasId },
  // });
  // console.log('1');
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
