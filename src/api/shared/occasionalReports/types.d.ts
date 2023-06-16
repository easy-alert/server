interface IAnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}

export interface ICreateOccassionalMaintenanceReport {
  buildingId: string;
  executionDate: string;
  responsibleSyndicId: string;
  origin: 'Company' | 'Backoffice' | 'Client';

  maintenanceData: {
    id: string;
    element: string;
    activity: string;
    responsible: string;
  };

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
    files: IAnnexesAndImages[];
    images: IAnnexesAndImages[];
  };
}
