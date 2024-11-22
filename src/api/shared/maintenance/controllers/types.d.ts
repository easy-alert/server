import type { MaintenancePriorityName } from '@prisma/client';

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
  priorityName: MaintenancePriorityName;
}

export interface ICreateMaintenanceBody extends MaintenanceBody {
  categoryId: string;
  instructions: { name: string; url: string }[];
}

export interface IEditMaintenanceBody extends MaintenanceBody {
  maintenanceId: string;
}
