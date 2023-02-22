export interface IRecurringDates {
  startDate: Date;
  endDate: Date;
  interval: number;
  maintenanceData: {
    id: string;
    element: string;
  };
}

export interface IAddDays {
  date: Date;
  days: number;
}

interface IMaintenancesData {
  Maintenances: {
    name: string;
    deliveryDate: Date;
    Categories: {
      Maintenances: {
        Maintenance: {
          id: string;
          element: string;
          PeriodTimeInterval: {
            name: string;
            unitTime: number;
          };
          DelayTimeInterval: {
            name: string;
            unitTime: number;
          };
          FrequencyTimeInterval: {
            name: string;
            unitTime: number;
          };
        };
      }[];
    }[];
  }[];
}
