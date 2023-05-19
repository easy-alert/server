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
    version?: number;
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

export interface IEditMaintenanceReports {
  maintenanceReportId: string;
  data: {
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
