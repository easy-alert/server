export interface ICreateOccassionalMaintenanceReport {
  categoryData: {
    id: string;
    name: string;
  };
  maintenanceData: {
    id: string;
    element: string;
    activity: string;
    responsible: string;
  };
}
