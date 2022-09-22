/* eslint-disable no-console */
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { prisma } from '../src/utils/prismaClient';

import { PermissionServices } from '../src/api/permission/services/permissionServices';

const permissionServices = new PermissionServices();

async function createPermissions() {
  console.log('starting permissions creation ...');
  const permissions: Prisma.PermissionCreateInput[] = [
    {
      name: 'Backoffice',
    },
    {
      name: 'User',
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.create({
      data: permission,
    });
    console.log('permission ', permission.name, ' inserted');
  }
}

async function createAdmin() {
  console.log('starting admin creation ...');
  // admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      passwordHash: hashSync('123123123', 12),
    },
  });

  console.log('starting admin permission creation ...');
  const permissionAdmin = await permissionServices.findByName({
    name: 'Backoffice',
  });

  await prisma.userPermissions.create({
    data: {
      userId: admin.id,
      permissionId: permissionAdmin!.id,
    },
  });
  console.log('permission ', permissionAdmin!.name, ' inserted in Admin');
}

async function createTimeIntervals() {
  console.log('starting timeIntervals creation ...');
  const timeIntervals: Prisma.TimeIntervalCreateInput[] = [
    {
      name: 'Day',
      unitTime: 1,
      singularLabel: 'dia',
      pluralLabel: 'dias',
    },
    {
      name: 'Week',
      unitTime: 7,
      singularLabel: 'semana',
      pluralLabel: 'semanas',
    },
    {
      name: 'Month',
      unitTime: 30,
      singularLabel: 'mês',
      pluralLabel: 'meses',
    },
    {
      name: 'Year',
      unitTime: 365,
      singularLabel: 'ano',
      pluralLabel: 'anos',
    },
  ];

  for (const timeInterval of timeIntervals) {
    await prisma.timeInterval.create({
      data: timeInterval,
    });
    console.log('timeIntervals ', timeInterval.name, ' inserted');
  }
}

async function main() {
  console.log('seed is running ...');
  await createPermissions();
  await createAdmin();
  await createTimeIntervals();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
