interface IAnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}

export interface ICreateOccasionalMaintenanceReport {
  buildingId: string;
  executionDate: string;
  responsibleSyndicId: string;
  origin: 'Company' | 'Backoffice' | 'Client';
  occasionalMaintenanceType: 'finished' | 'pending';

  maintenanceData: {
    id: string;
    element: string;
    activity: string;
    responsible: string;
  };

  inProgress: boolean;
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

  ticketIds?: string[];
}
