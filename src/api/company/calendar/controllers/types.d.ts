export interface IDates {
  notificationDate: Date;
  Building: {
    id: string;
    name: string;
  };
  Maintenance: {
    id: string;
    element: string;
    frequency: number;
    FrequencyTimeInterval: {
      unitTime: number;
      singularLabel: string;
      pluralLabel: string;
    };
  };
  MaintenancesStatus: {
    name: string;
    pluralLabel: string;
    singularLabel: string;
  };
}
[];
