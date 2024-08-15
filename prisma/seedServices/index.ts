/* eslint-disable no-console */
import { Prisma, TicketStatusName } from '@prisma/client';
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
      image: 'https://larguei.s3.us-west-2.amazonaws.com/1635276982966-1678106031894.jpg',
      isNotifyingOnceAWeek: false,
      canAccessChecklists: false,
      canAccessTickets: false,
      receiveDailyDueReports: false,
      receivePreviousMonthReports: false,
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

  async createMaintenancesStatus() {
    await prisma.maintenancesStatus.createMany({
      data: [
        {
          name: 'expired',
          singularLabel: 'vencida',
          pluralLabel: 'vencidas',
        },
        {
          name: 'pending',
          singularLabel: 'pendente',
          pluralLabel: 'pendentes',
        },
        {
          name: 'completed',
          singularLabel: 'concluída',
          pluralLabel: 'concluídas',
        },
        {
          name: 'overdue',
          singularLabel: 'feita em atraso',
          pluralLabel: 'feitas em atraso',
        },
      ],
    });
  }

  async createCategoryAndMaintenanceTypes() {
    await prisma.categoryAndMaintenanceTypes.createMany({
      data: [
        {
          name: 'occasional',
          singularLabel: 'avulsa',
          pluralLabel: 'avulsas',
        },
        {
          name: 'common',
          singularLabel: 'comum',
          pluralLabel: 'comuns',
        },
      ],
    });
  }

  async upsertTicketPlaces() {
    const allData = [{ label: 'Área comum' }, { label: 'Meu apartamento' }];

    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];

      await prisma.ticketPlace.upsert({
        create: data,
        update: {},
        where: data,
      });
    }

    console.log('Ticket places upserted.');
  }

  async upsertTicketServiceTypes() {
    const allData = [
      { label: 'Hidráulica' },
      { label: 'Elétrica' },
      { label: 'Pintura' },
      { label: 'Mecânica' },
      { label: 'Portas e janelas' },
      { label: 'Gás' },
      { label: 'Acabamentos' },
      { label: 'Outros' },
    ];

    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];

      await prisma.serviceType.upsert({
        create: data,
        update: {},
        where: data,
      });
    }

    console.log('Ticket service types upserted.');
  }

  async upsertTicketStatus() {
    const allData = [
      {
        name: TicketStatusName.open,
        label: 'Aberto',
        color: '#FFFFFF',
        backgroundColor: '#B21D1D',
      },
      {
        name: TicketStatusName.finished,
        label: 'Finalizado',
        color: '#FFFFFF',
        backgroundColor: '#34B53A',
      },
      {
        name: TicketStatusName.awaitingToFinish,
        label: 'Aguardando finalização',
        color: '#FFFFFF',
        backgroundColor: '#FFB200',
      },
    ];

    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];

      await prisma.ticketStatus.upsert({
        create: data,
        update: {},
        where: {
          name: data.name,
        },
      });
    }

    console.log('Ticket status upserted.');
  }

  async upsertSupplierAreaOfActivities() {
    const allData = [
      { label: 'Hidráulica' },
      { label: 'Elétrica' },
      { label: 'Pintura' },
      { label: 'Mecânica' },
      { label: 'Portas e janelas' },
      { label: 'Gás' },
      { label: 'Acabamentos' },
      { label: 'Outros' },
    ];

    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];

      await prisma.areaOfActivity.upsert({
        create: data,
        update: {},
        where: data,
      });
    }

    console.log('Area of activities upserted.');
  }
}
