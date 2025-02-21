export interface ICreateAndEditMaintenanceReportsBody {
  origin: 'Backoffice' | 'Company' | 'Client';

  userId: string;
  maintenanceReportId: string;
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
