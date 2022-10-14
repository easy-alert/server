/* eslint-disable no-console */
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { prisma } from '../../src/utils/prismaClient';
import { PermissionServices } from '../../src/api/shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();

export class SeedServices {
  async createPermissions() {
    console.log('/n/nstarting permissions creation ...');

    const permissions: Prisma.PermissionCreateInput[] = [
      {
        name: 'Backoffice',
      },
      {
        name: 'Company',
      },
      {
        name: 'BuildingManager',
      },
    ];

    for (const permission of permissions) {
      await prisma.permission.create({
        data: permission,
      });
      console.log('permission ', permission.name, ' inserted.');
    }
  }

  async createAdminBackoffice() {
    console.log('/n/nstarting Admin creation ...');

    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@gmail.com',
        passwordHash: hashSync('123123123', 12),
      },
    });

    const permissions = [
      {
        name: 'Backoffice',
      },
      {
        name: 'Company',
      },
    ];

    for (const permission of permissions) {
      const permissionData = await permissionServices.findByName({
        name: permission.name,
      });

      await prisma.userPermissions.create({
        data: {
          userId: admin.id,
          permissionId: permissionData!.id,
        },
      });
      console.log('permission ', permissionData!.name, ' inserted in Admin.');
    }
  }

  async createTimeIntervals() {
    console.log('/n/nstarting timeIntervals creation ...');
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
      console.log('timeIntervals ', timeInterval.name, ' inserted.');
    }
  }
}
