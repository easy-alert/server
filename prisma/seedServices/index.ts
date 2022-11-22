/* eslint-disable no-console */
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

// CLASS
import { PermissionServices } from '../../src/api/shared/permission/services/permissionServices';
import { CompanyServices } from '../../src/api/backoffice/users/accounts/services/companyServices';
import { prisma } from '..';

const permissionServices = new PermissionServices();
const companyServices = new CompanyServices();

export class SeedServices {
  async createPermissions() {
    console.log('\n\nstarting permissions creation ...');

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
    console.log('\n\nstarting Admin creation ...');

    const backoffice = await prisma.user.create({
      data: {
        name: 'Backoffice',
        email: 'backoffice@gmail.com',
        passwordHash: hashSync('123123123', 12),
      },
    });

    const permissions = [
      {
        name: 'Backoffice',
      },
    ];

    for (const permission of permissions) {
      const permissionData = await permissionServices.findByName({
        name: permission.name,
      });

      await prisma.userPermissions.create({
        data: {
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
      });
      console.log('permission ', permissionData!.name, ' inserted in Admin.');
    }
  }

  async createAdminCompany() {
    console.log('\n\nstarting Company creation ...');

    const backoffice = await prisma.user.create({
      data: {
        name: 'Company',
        email: 'company@gmail.com',
        passwordHash: hashSync('123123123', 12),
      },
    });

    const company = await companyServices.create({
      name: 'Company',
      contactNumber: '0000000000',
      CNPJ: '00000000000000',
      CPF: null,
      image:
        'https://media-exp1.licdn.com/dms/image/C4E0BAQF64xW4lNwbcg/company-logo_200_200/0/1635276982966?e=2147483647&v=beta&t=HKGD4nOWB9-zMFmm9U5MMvyxdXhQYnypageYeBPnIBE',
    });

    await companyServices.createUserCompany({
      companyId: company.id,
      userId: backoffice.id,
      owner: true,
    });

    const permissions = [
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
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
      });
      console.log('permission ', permissionData!.name, ' inserted in Company.');
    }
  }

  async createTimeIntervals() {
    console.log('\n\nstarting timeIntervals creation ...');
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

  async createBuildingsTypes() {
    console.log('\n\nstarting Building Types creation ...');

    const buildingsTypes = [
      { name: 'ampliações' },
      { name: 'casa' },
      { name: 'condomínio horizontal' },
      { name: 'prédio' },
      { name: 'reformas' },
      { name: 'outro' },
    ];

    await prisma.buildingType.createMany({
      data: buildingsTypes,
    });
  }
}
