export interface ICreateMaintenanceHistory {
  maintenanceId: string;
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

export interface IEditMaintenance {
  maintenanceId: string;
  element: string;
}

export interface ICreateMaintenance {
  categoryId: string;
  element: string;
}
