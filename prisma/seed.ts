/* eslint-disable no-console */

import { prisma } from '.';
import { SeedServices } from './seedServices';

const seedServices = new SeedServices();

async function main() {
  console.log('seed is running ...');

  await seedServices.upsertPermissions();

  await seedServices.createAdminBackoffice();
  await seedServices.createAdminCompany();
  await seedServices.createTimeIntervals();
  await seedServices.createBuildingsTypes();
  await seedServices.createMaintenancesStatus();
  await seedServices.createCategoryAndMaintenanceTypes();
  await seedServices.upsertMaintenancePriorities();

  await seedServices.upsertTicketPlaces();
  await seedServices.upsertTicketServiceTypes();
  await seedServices.upsertTicketStatus();
  await seedServices.upsertTicketDismissReasons();

  await seedServices.updateOwnerUsers();

  await seedServices.ownerBuildingPermissions();

  await seedServices.fixTicketsNumbers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
