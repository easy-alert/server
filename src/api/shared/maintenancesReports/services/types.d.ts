export interface ICreateMaintenanceReports {
  data: {
    origin: 'Backoffice' | 'Company' | 'Client';
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

export interface ICreateMaintenanceReportsHistory {
  data: {
    origin: 'Backoffice' | 'Company' | 'Client';
    maintenanceReportId: string;
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
