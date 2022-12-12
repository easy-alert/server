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
