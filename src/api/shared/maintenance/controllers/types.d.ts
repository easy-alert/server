interface MaintenanceBody {
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
  observation: string;
}

export interface ICreateMaintenanceBody extends MaintenanceBody {
  categoryId: string;
}

export interface IEditMaintenanceBody extends MaintenanceBody {
  maintenanceId: string;
}
