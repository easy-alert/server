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
  maintenanceTypeId: string;
}

export interface IEditMaintenance {
  maintenanceId: string;
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

export interface ICreateMaintenance {
  categoryId: string;

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
  maintenanceTypeId: string;
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
      origin: string;
      ReportAnnexes: {
        createMany: {
          data: {
            name;
            originalName;
            url;
          }[];
        };
      };

      ReportImages: {
        createMany: {
          data: {
            name: string;
            originalName: string;
            url: string;
          }[];
        };
      };
    };
  };
}

export interface IChangeMaintenanceHistoryStatus {
  maintenanceHistoryId: string;
  maintenanceStatusId: string;
  resolutionDate: Date;
}
