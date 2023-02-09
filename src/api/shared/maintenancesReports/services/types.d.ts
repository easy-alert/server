export interface ICreateMaintenanceReports {
  data: {
    maintenanceHistoryId: string;
    cost: number;
    observation: string;
    ReportImages: {
      createMany: {
        data: {
          name: string;
          originalName: string;
          url: string;
        }[];
      };
    };
    ReportAnnexes: {
      createMany: {
        data: {
          name: string;
          originalName: string;
          url: string;
        }[];
      };
    };
  };
}
