export interface ICreateMaintenanceHistory {
  maintenanceId: string;
  element: string;
  activity: string;
  frequency: number;
  responsible: string;
  source: string;
  period: number;
  delay: number;
  observation: string | null;
}
