interface Maintenance {
  isSelected: boolean;
  id: string;
  element: string;
  activity: string;
  frequency: number;
  delay: number;
  period: number;
  responsible: string;
  source: string;
  observation: string;
  ownerCompanyId: string;
  FrequencyTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
  };
  DelayTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
  };
  PeriodTimeInterval: {
    id: string;
    name: string;
    pluralLabel: string;
    singularLabel: string;
  };
}

export interface IListBuildingCategoriesAndMaintenances {
  id: string;
  ownerCompanyId: string;
  name: string;
  Maintenances: Maintenance[];
}

interface IDateForCreateHistory {
  buildingId: string;
  ownerCompanyId: string;
  maintenanceId: string;
  maintenanceStatusId: string;
  notificationDate: Date;
  resolutionDate?: Date;
  dueDate?: Date;
}
