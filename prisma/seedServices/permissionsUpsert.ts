import type { TModulesNames } from '../../src/types/TModulesNames';
import type { TPermissionsNames } from '../../src/types/TPermissionsNames';

export interface IPermissionUpsert {
  name: TPermissionsNames;
  label: string;
  moduleName: TModulesNames;
  moduleLabel: string;
}

export const adminPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'admin',
    moduleLabel: 'Admin',
    name: 'admin:backoffice',
    label: 'Admin Backoffice',
  },
  { moduleName: 'admin', moduleLabel: 'Admin', name: 'admin:company', label: 'Admin Company' },
  { moduleName: 'admin', moduleLabel: 'Admin', name: 'admin:client', label: 'Admin Client' },
];

export const accessPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:backoffice',
    label: 'Acesso Backoffice',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:company',
    label: 'Acesso Company',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:client',
    label: 'Acesso Client',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:dashboard',
    label: 'Acesso Dashboard',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:calendarMaintenances',
    label: 'Acesso Calendário de Manutenções',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:calendarTickets',
    label: 'Acesso Calendário de Chamados',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:buildings',
    label: 'Acesso Edifícios',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:maintenances',
    label: 'Acesso Manutenções',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:checklist',
    label: 'Acesso Checklist',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:tickets',
    label: 'Acesso Chamados',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:reports',
    label: 'Acesso Relatórios',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:suppliers',
    label: 'Acesso Fornecedores',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:tutorials',
    label: 'Acesso Tutorials',
  },
  {
    moduleName: 'access',
    moduleLabel: 'Acessos',
    name: 'access:account',
    label: 'Acesso Conta',
  },
];

export const buildingsPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'buildings',
    moduleLabel: 'Edifícios',
    name: 'buildings:create',
    label: 'Criar Edifícios',
  },
  {
    moduleName: 'buildings',
    moduleLabel: 'Edifícios',
    name: 'buildings:update',
    label: 'Atualizar Edifícios',
  },
  {
    moduleName: 'buildings',
    moduleLabel: 'Edifícios',
    name: 'buildings:delete',
    label: 'Deletar Edifícios',
  },
];

export const maintenancesPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:createOccasional',
    label: 'Criar Avulsa',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:update',
    label: 'Editar Manutenções',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:updateDates',
    label: 'Editar Prazos',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:delete',
    label: 'Excluir Manutenções',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:plan',
    label: 'Plano de Manutenção',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:finish',
    label: 'Finalizar Manutenção',
  },
  {
    moduleName: 'maintenances',
    moduleLabel: 'Manutenções',
    name: 'maintenances:livePhoto',
    label: 'Foto em tempo real',
  },
];

export const ticketsPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'tickets',
    moduleLabel: 'Chamados',
    name: 'tickets:create',
    label: 'Criar Chamados',
  },
  {
    moduleName: 'tickets',
    moduleLabel: 'Chamados',
    name: 'tickets:update',
    label: 'Atualizar Chamados',
  },
  {
    moduleName: 'tickets',
    moduleLabel: 'Chamados',
    name: 'tickets:delete',
    label: 'Deletar Chamados',
  },
];

export const checklistPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'checklist',
    moduleLabel: 'Checklist',
    name: 'checklist:create',
    label: 'Criar Checklist',
  },
  {
    moduleName: 'checklist',
    moduleLabel: 'Checklist',
    name: 'checklist:update',
    label: 'Atualizar Checklist',
  },
  {
    moduleName: 'checklist',
    moduleLabel: 'Checklist',
    name: 'checklist:delete',
    label: 'Deletar Checklist',
  },
  {
    moduleName: 'checklist',
    moduleLabel: 'Checklist',
    name: 'checklist:livePhoto',
    label: 'Foto em tempo real',
  },
];

export const managementPermissions: IPermissionUpsert[] = [
  {
    moduleName: 'management',
    moduleLabel: 'Gestão',
    name: 'management:checklist',
    label: 'Checklist',
  },
  {
    moduleName: 'management',
    moduleLabel: 'Gestão',
    name: 'management:account',
    label: 'Conta',
  },
];
