/* eslint-disable no-console */
import {
  Prisma,
  TicketDismissReasonsName,
  TicketStatusName,
  MaintenancePriorityName,
} from '@prisma/client';
import { hashSync } from 'bcrypt';
import { prisma } from '..';

// SERVICES
import { CompanyServices } from '../../src/api/backoffice/account/companies/services/companyServices';
import { PermissionServices } from '../../src/api/shared/permissions/permission/services/permissionServices';

// PERMISSIONS
import {
  IPermissionUpsert,
  accessPermissions,
  adminPermissions,
  buildingsPermissions,
  checklistPermissions,
  maintenancesPermissions,
  managementPermissions,
  ticketsPermissions,
} from './permissionsUpsert';

const permissionServices = new PermissionServices();
const companyServices = new CompanyServices();

export class SeedServices {
  async upsertPermissions() {
    const modulePermissions: IPermissionUpsert[] = [
      // admin permissions
      ...adminPermissions,

      // access permissions
      ...accessPermissions,

      // buildings permissions
      ...buildingsPermissions,

      // tickets permissions
      ...ticketsPermissions,

      // checklists permissions
      ...checklistPermissions,

      // maintenance permissions
      ...maintenancesPermissions,

      // management permissions
      ...managementPermissions,
    ];

    for (const modulePermission of modulePermissions) {
      await prisma.permission.upsert({
        create: modulePermission,
        update: modulePermission,
        where: {
          name: modulePermission.name,
        },
      });

      console.log('permission ', modulePermission.name, ' inserted.');
    }
  }

  async createAdminBackoffice() {
    console.log('\n\nstarting Admin creation ...');

    const backofficeData = {
      name: 'Backoffice',
      email: 'backoffice@gmail.com',
      passwordHash: hashSync('123123123', 12),
    };

    const backoffice = await prisma.user.upsert({
      create: backofficeData,
      update: backofficeData,
      where: {
        email: backofficeData.email,
      },
    });

    const permissions = [
      {
        name: 'admin:backoffice',
      },
    ];

    for (const permission of permissions) {
      const permissionData = await permissionServices.findByName({
        name: permission.name,
      });

      await prisma.userPermissions.upsert({
        create: {
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
        update: {
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
        where: {
          companyId_userId_permissionId: {
            companyId: '',
            userId: backoffice.id,
            permissionId: permissionData!.id,
          },
        },
      });

      console.log('permission ', permissionData!.name, ' inserted in Admin.');
    }

    console.log('Backoffice admin created.');
  }

  async createAdminCompany() {
    console.log('\n\nstarting Company creation ...');

    const companyData = {
      name: 'Company',
      email: 'company@gmail.com',
      passwordHash: hashSync('123123123', 12),
    };

    const backoffice = await prisma.user.upsert({
      create: companyData,
      update: companyData,
      where: {
        email: companyData.email,
      },
    });

    const company = await companyServices.create({
      name: 'Company',
      contactNumber: '0000000000',
      CNPJ: '00000000000000',
      CPF: null,
      image: 'https://larguei.s3.us-west-2.amazonaws.com/1635276982966-1678106031894.jpg',
      isNotifyingOnceAWeek: false,
      canAccessChecklists: true,
      canAccessTickets: true,
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
        name: 'admin:company',
      },
    ];

    for (const permission of permissions) {
      const permissionData = await permissionServices.findByName({
        name: permission.name,
      });

      await prisma.userPermissions.upsert({
        create: {
          companyId: company.id,
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
        update: {
          companyId: company.id,
          userId: backoffice.id,
          permissionId: permissionData!.id,
        },
        where: {
          companyId_userId_permissionId: {
            companyId: company.id,
            userId: backoffice.id,
            permissionId: permissionData!.id,
          },
        },
      });

      console.log('permission ', permissionData!.name, ' inserted in Company.');
    }

    console.log('Company admin created.');
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
      await prisma.timeInterval.upsert({
        create: timeInterval,
        update: timeInterval,
        where: {
          name: timeInterval.name,
        },
      });

      console.log('timeIntervals ', timeInterval.name, ' inserted.');
    }

    console.log('TimeIntervals upserted.');
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

    for (const buildingType of buildingsTypes) {
      await prisma.buildingType.upsert({
        create: buildingType,
        update: buildingType,
        where: {
          name: buildingType.name,
        },
      });

      console.log('buildingType ', buildingType.name, ' inserted.');
    }

    console.log('Building Types upserted.');
  }

  async createMaintenancesStatus() {
    console.log('\n\nstarting Maintenances Status creation ...');

    const maintenancesStatus = [
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
    ];

    for (const maintenanceStatus of maintenancesStatus) {
      await prisma.maintenancesStatus.upsert({
        create: maintenanceStatus,
        update: maintenanceStatus,
        where: {
          name: maintenanceStatus.name,
        },
      });

      console.log('maintenanceStatus ', maintenanceStatus.name, ' inserted.');
    }

    console.log('Maintenances Status upserted.');
  }

  async createCategoryAndMaintenanceTypes() {
    console.log('\n\nstarting Category And Maintenance Types creation ...');

    const categoryAndMaintenanceTypes = [
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
    ];

    for (const categoryAndMaintenanceType of categoryAndMaintenanceTypes) {
      await prisma.categoryAndMaintenanceTypes.upsert({
        create: categoryAndMaintenanceType,
        update: categoryAndMaintenanceType,
        where: {
          name: categoryAndMaintenanceType.name,
        },
      });

      console.log('categoryAndMaintenanceType ', categoryAndMaintenanceType.name, ' inserted.');
    }

    console.log('Category And Maintenance Types upserted.');
  }

  async upsertTicketPlaces() {
    console.log('\n\nstarting Ticket Places creation ...');

    const ticketPlaces = [
      {
        label: 'Área comum',
      },
      {
        label: 'Meu apartamento',
      },
    ];

    for (const ticketPlace of ticketPlaces) {
      await prisma.ticketPlace.upsert({
        create: ticketPlace,
        update: ticketPlace,
        where: ticketPlace,
      });

      console.log('ticketPlace ', ticketPlace.label, ' inserted.');
    }

    console.log('Ticket Places upserted.');
  }

  async upsertTicketServiceTypes() {
    const ticketServiceTypes = [
      {
        name: 'hydraulics',
        label: 'Hidráulica',
        singularLabel: 'Hidráulica',
        pluralLabel: 'Hidráulicas',
        color: '#FFFFFF',
        backgroundColor: '#087EB4',
      },
      {
        name: 'electrical',
        label: 'Elétrica',
        singularLabel: 'Elétrica',
        pluralLabel: 'Elétricas',
        color: '#FFFFFF',
        backgroundColor: '#FFDE08',
      },
      {
        name: 'painting',
        label: 'Pintura',
        singularLabel: 'Pintura',
        pluralLabel: 'Pinturas',
        color: '#FFFFFF',
        backgroundColor: '#07D918',
      },
      {
        name: 'mechanical',
        label: 'Mecânica',
        singularLabel: 'Mecânica',
        pluralLabel: 'Mecânicas',
        color: '#FFFFFF',
        backgroundColor: '#D90707',
      },
      {
        name: 'doorsAndWindows',
        label: 'Portas e janelas',
        singularLabel: 'Portas e janelas',
        pluralLabel: 'Portas e janelas',
        color: '#FFFFFF',
        backgroundColor: '#D207d9',
      },
      {
        name: 'gas',
        label: 'Gás',
        singularLabel: 'Gás',
        pluralLabel: 'Gás',
        color: '#FFFFFF',
        backgroundColor: '#9E590E',
      },
      {
        name: 'finishing',
        label: 'Acabamentos',
        singularLabel: 'Acabamento',
        pluralLabel: 'Acabamentos',
        color: '#FFFFFF',
        backgroundColor: '#0BD6CF',
      },
      {
        name: 'others',
        label: 'Outros',
        singularLabel: 'Outro',
        pluralLabel: 'Outros',
        color: '#FFFFFF',
        backgroundColor: '#8C9191',
      },
    ];

    ticketServiceTypes.forEach(async (ticketServiceType) => {
      await prisma.serviceType.upsert({
        create: ticketServiceType,
        update: ticketServiceType,
        where: {
          label: ticketServiceType.label,
        },
      });

      console.log('ticketServiceType ', ticketServiceType.label, ' inserted.');
    });

    console.log('Ticket service types upserted.');
  }

  async upsertTicketStatus() {
    console.log('\n\nstarting Ticket Status creation ...  ');

    const ticketsStatus = [
      {
        name: TicketStatusName.open,
        label: 'Aberto',
        color: '#000000',
        backgroundColor: '#FFFFFF',
      },
      {
        name: TicketStatusName.awaitingToFinish,
        label: 'Aguardando finalização',
        color: '#FFFFFF',
        backgroundColor: '#FFB200',
      },
      {
        name: TicketStatusName.finished,
        label: 'Finalizado',
        color: '#FFFFFF',
        backgroundColor: '#34B53A',
      },
      {
        name: TicketStatusName.dismissed,
        label: 'Indeferido',
        color: '#FFFFFF',
        backgroundColor: '#B21D1D',
      },
    ];

    for (const ticketStatus of ticketsStatus) {
      await prisma.ticketStatus.upsert({
        create: ticketStatus,
        update: ticketStatus,
        where: {
          name: ticketStatus.name,
        },
      });

      console.log('ticketStatus ', ticketStatus.name, ' inserted.');
    }

    console.log('Ticket Status upserted.');
  }

  async upsertTicketDismissReasons() {
    console.log('\n\nstarting Ticket Reasons creation ...');

    const ticketReasons = [
      {
        name: TicketDismissReasonsName.outOfWarranty,
        label: 'Fora de garantia',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },
      {
        name: TicketDismissReasonsName.outOfResponsibility,
        label: 'Fora da responsabilidade',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },

      {
        name: TicketDismissReasonsName.lackOfInformation,
        label: 'Falta de informações/entendimento',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },
      {
        name: TicketDismissReasonsName.lackOfResources,
        label: 'Falta de recursos',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },
      {
        name: TicketDismissReasonsName.lackOfApproval,
        label: 'Falta de aprovação',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },
      {
        name: TicketDismissReasonsName.other,
        label: 'Outro',
        color: '#FFFFFF',
        backgroundColor: '#000000',
      },
    ];

    for (const ticketReason of ticketReasons) {
      await prisma.ticketDismissReasons.upsert({
        create: ticketReason,
        update: ticketReason,
        where: {
          name: ticketReason.name,
        },
      });

      console.log('ticketReason ', ticketReason.name, ' inserted.');
    }

    console.log('Ticket Reasons upserted.');
  }

  async upsertMaintenancePriorities() {
    console.log('\n\nstarting Maintenance Priorities creation ...');

    const maintenancePriorities = [
      {
        name: MaintenancePriorityName.low,
        label: 'Baixa',
        color: '#FFFFFF',
        backgroundColor: '#34B53A',
      },
      {
        name: MaintenancePriorityName.medium,
        label: 'Média',
        color: '#FFFFFF',
        backgroundColor: '#FFB200',
      },
      {
        name: MaintenancePriorityName.high,
        label: 'Alta',
        color: '#FFFFFF',
        backgroundColor: '#FF0000',
      },
    ];

    for (const maintenancePriority of maintenancePriorities) {
      await prisma.maintenancePriority.upsert({
        create: maintenancePriority,
        update: maintenancePriority,
        where: {
          name: maintenancePriority.name,
        },
      });

      console.log('maintenancePriority ', maintenancePriority.name, ' inserted.');
    }

    console.log('Maintenance Priorities upserted.');
  }

  async updateOwnerUsers() {
    console.log('\n\nstarting Owner Users update ...');

    const ownerUsers = await prisma.userCompanies.findMany({
      where: {
        owner: true,
      },
    });

    for (const ownerUser of ownerUsers) {
      const company = await prisma.company.findUnique({
        where: {
          id: ownerUser.companyId,
        },
      });

      if (!company) {
        console.error('Company not found for Owner User ', ownerUser.userId);
        continue;
      }

      if (company.isBlocked) {
        console.log('Company ', company!.name, ' is blocked.');
        continue;
      }

      try {
        await prisma.user.update({
          where: {
            id: ownerUser.userId,
          },
          data: {
            emailIsConfirmed: true,
            phoneNumber: company.contactNumber,
            phoneNumberIsConfirmed: true,
          },
        });
      } catch (error) {
        console.error('Error updating Owner User in Company ', company!.name);
        continue;
      }

      console.log('Owner User updated in Company ', company!.name);
    }

    console.log('Owner Users updated.');
  }

  async ownerBuildingPermissions() {
    console.log('\n\nstarting Owner Building Permissions creation ...');

    const ownerUsers = await prisma.userCompanies.findMany({
      where: {
        owner: true,
      },
    });

    for (const ownerUser of ownerUsers) {
      console.log('Owner User ', ownerUser.userId);

      const company = await prisma.company.findUnique({
        where: {
          id: ownerUser.companyId,
        },
      });

      if (!company) {
        console.error('Company not found for Owner User ', ownerUser.userId);
        continue;
      }

      console.log('Company ', company.name);

      const companyBuildings = await prisma.building.findMany({
        where: {
          companyId: company.id,
        },
      });

      if (!companyBuildings.length) {
        console.error('Company Buildings not found for Company ', company!.name);
        continue;
      }

      try {
        for (const building of companyBuildings) {
          const buildingMainContact = await prisma.userBuildingsPermissions.findFirst({
            where: {
              buildingId: building.id,
              isMainContact: true,
            },
          });

          await prisma.userBuildingsPermissions.upsert({
            create: {
              userId: ownerUser.userId,
              buildingId: building.id,
              isMainContact: !buildingMainContact,
              showContact: true,
            },
            update: {
              userId: ownerUser.userId,
              buildingId: building.id,
              isMainContact: !buildingMainContact,
              showContact: true,
            },
            where: {
              userId_buildingId: {
                userId: ownerUser.userId,
                buildingId: building.id,
              },
            },
          });

          console.log('Owner Building Permissions created in Building ', building.name);
        }
      } catch (error) {
        console.error('Error creating Owner Building Permissions in Company ', company!.name);
        continue;
      }
    }

    console.log('Owner Building Permissions created.');
  }

  async fixTicketsNumbers() {
    console.log('\n\nstarting Fix Tickets Numbers ...');

    const buildings = await prisma.building.findMany();

    for (const building of buildings) {
      const tickets = await prisma.ticket.findMany({
        where: {
          buildingId: building.id,
        },

        orderBy: {
          createdAt: 'asc',
        },
      });

      if (!tickets.length) {
        console.log(`No tickets found for building ${building.id}`);
        continue;
      }

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        await prisma.ticket.update({
          where: {
            id: ticket.id,
          },

          data: {
            ticketNumber: i + 1,
          },
        });

        console.log(`Ticket ${ticket.id} updated with number ${i + 1}`);
      }

      // Use the tickets variable here
      console.log(`Found ${tickets.length} tickets for building ${building.id}`);
    }

    console.log('Tickets Numbers fixed.');
  }

  async fillCompanyIdToChecklistTemplate() {
    console.log('\n\nstarting Fill CompanyId to Checklist Template ...');

    const checklistTemplates = await prisma.checklistTemplate.findMany();

    for (const checklistTemplate of checklistTemplates) {
      const checklistTemplateBuilding = await prisma.building.findUnique({
        where: {
          id: checklistTemplate.buildingId,
        },
      });

      if (!checklistTemplateBuilding) {
        console.log('Checklist Template ', checklistTemplate.id, ' has no building.');
        continue;
      }

      await prisma.checklistTemplate.update({
        where: {
          id: checklistTemplate.id,
        },
        data: {
          companyId: checklistTemplateBuilding.companyId,
        },
      });
    }

    console.log('CompanyId filled to Checklist Template.');
  }

  async blockBuildingsOfBlockedCompanies() {
    console.log('\n\nstarting Block Buildings of Blocked Companies ...');

    const blockedCompanies = await prisma.company.findMany({
      where: {
        isBlocked: true,
      },
    });

    for (const blockedCompany of blockedCompanies) {
      const buildings = await prisma.building.findMany({
        where: {
          companyId: blockedCompany.id,
        },
      });

      for (const building of buildings) {
        await prisma.building.update({
          where: {
            id: building.id,
          },
          data: {
            isBlocked: true,
          },
        });
      }
    }

    console.log('Buildings of Blocked Companies blocked.');
  }

  async upsertUserPermissionsWithCompanyId() {
    console.log('\n\nstarting User Permissions with CompanyId ...');

    const users = await prisma.user.findMany();

    for (const user of users) {
      const userCompany = await prisma.userCompanies.findFirst({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: 'asc',
        },
      });

      if (!userCompany) {
        console.log('User ', user.id, ' has no company.');
        continue;
      }

      try {
        await prisma.userPermissions.updateMany({
          where: {
            userId: user.id,
          },

          data: {
            companyId: userCompany?.companyId,
          },
        });
      } catch (error) {
        console.error('Error updating User Permissions with CompanyId for user ', user.id, error);

        continue;
      }
    }

    console.log('User Permissions with CompanyId upserted.');
  }

  async addMaintenanceServiceOrderNumber() {
    console.log('\n\nstarting Maintenance Service Order Number ...');

    const companies = await prisma.company.findMany();

    // Helper to run promises with concurrency limit
    async function runWithConcurrencyLimit<T>(
      tasks: (() => Promise<T>)[],
      limit: number,
    ): Promise<T[]> {
      const results: T[] = [];
      const executing: Promise<void>[] = [];
      let i = 0;

      const enqueue = async () => {
        if (i === tasks.length) return;
        const taskIndex = i++;
        const p = tasks[taskIndex]()
          .then((res) => {
            results[taskIndex] = res;
          })
          .catch((err) => {
            throw err;
          });
        executing.push(
          p.then(async () => {
            executing.splice(executing.indexOf(p), 1);
          }),
        );
        if (executing.length >= limit) {
          await Promise.race(executing);
        }
        await enqueue();
      };

      await enqueue();
      await Promise.all(executing);
      return results;
    }

    for (const company of companies) {
      const maintenancesHistory = await prisma.maintenanceHistory.findMany({
        where: { ownerCompanyId: company.id },
        orderBy: { createdAt: 'asc' },
      });

      if (!maintenancesHistory.length) {
        continue;
      }

      // Prepare update functions
      const updateTasks = maintenancesHistory.map(
        (maintenanceHistory, idx) => () =>
          prisma.maintenanceHistory.update({
            where: { id: maintenanceHistory.id },
            data: { serviceOrderNumber: idx + 1 },
          }),
      );

      // Run updates with concurrency limit (e.g., 2 at a time)
      await runWithConcurrencyLimit(updateTasks, 2);

      console.log(
        `Updated ${maintenancesHistory.length} maintenance histories for company ${company.name}`,
      );
    }

    console.log('Maintenance Service Order Number added.');
  }
}
