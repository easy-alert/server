export interface ICreateMaintenanceReportsBody {
  maintenanceHistoryId: string;
  cost: string;
  observation: string;

  ReportImages: {
    name: string;
    originalName: string;
    url: string;
  }[];

  ReportAnnexes: {
    name: string;
    originalName: string;
    url: string;
  }[];
}
