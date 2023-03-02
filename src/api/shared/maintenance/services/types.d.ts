interface IMaintenance {
  ownerCompanyId: string | null;
  element: string;
  activity: string;
  frequency: number;
  frequencyTimeIntervalId: string;
  responsible: string;
  source: string;
  period: number;
  periodTimeIntervalId: string;
  delay: number;
  delayTimeIntervalId: string;
  observation: string | null;
}

export interface IEditMaintenance extends IMaintenance {
  maintenanceId: string;
}

export interface ICreateMaintenance extends IMaintenance {
  categoryId: string;
}

export interface IMaintenanceHistory {
  buildingId: string;
  ownerCompanyId: string;
  maintenanceId: string;
  maintenanceStatusId: string;
  notificationDate: Date;
  resolutionDate?: Date;
  dueDate: Date;
}

export interface ICreateMaintenanceHistoryAndReport {
  buildingId: string;
  ownerCompanyId: string;
  maintenanceId: string;
  maintenanceStatusId: string;
  notificationDate: Date;
  resolutionDate?: Date;
  dueDate: Date;

  MaintenanceReport: {
    create: {
      cost: number;
      observation: string;
      responsibleSyndicId: string | null;
    };
  };
}

export interface IChangeMaintenanceHistoryStatus {
  maintenanceHistoryId: string;
  maintenanceStatusId: string;
  resolutionDate: Date;
}
