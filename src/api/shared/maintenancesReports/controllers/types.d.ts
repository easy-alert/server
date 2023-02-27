export interface ICreateMaintenanceReportsBody {
  maintenanceHistoryId: string;
  cost: number;
  observation: string;
  responsibleSyndicId?: string;

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

export interface IAttachments {
  filename: string;
  path: string;
}
