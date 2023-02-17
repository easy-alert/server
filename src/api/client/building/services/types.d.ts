export interface ISeparePerMonthData {
  id: string;
  notificationDate: Date;
  resolutionDate: null | Date;
  dueDate: Date;
  Building: {
    id: string;
    name: string;
    Banners: {
      id: string;
      bannerName: string;
      originalName: string;
      redirectUrl: string;
      url: string;
      type: string;
    }[];
  };
  Maintenance: {
    id: string;
    element: string;
    frequency: number;
    activity: string;
    FrequencyTimeInterval: { unitTime: number; singularLabel: string; pluralLabel: string };
  };
  MaintenancesStatus: {
    name: string;
    pluralLabel: string;
    singularLabel: string;
  };
}
