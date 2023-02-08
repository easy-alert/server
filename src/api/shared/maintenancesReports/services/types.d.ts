export interface ICreateMaintenanceReports {
  data: {
    maintenanceHistoryId: string;
    cost: string;
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
