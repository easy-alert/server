/* eslint-disable no-console */

import { prisma } from '../src/utils/prismaClient';
import { SeedServices } from './seedServices';

const seedServices = new SeedServices();

async function main() {
  console.log('seed is running ...');

  await seedServices.createPermissions();

  await seedServices.createAdminBackoffice();

  await seedServices.createTimeIntervals();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
