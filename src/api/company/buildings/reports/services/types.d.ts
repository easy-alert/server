export interface IFindBuildingMaintenancesHistory {
  companyId: string;
  queryFilter: {
    maintenanceStatusIds: string[] | undefined;
    buildingIds: string[] | undefined;
    categoryNames: string[] | undefined;
    dateFilter: { gte: Date; lte: Date };
    filterBy: string;
  };
}

export interface IListForBuildingReportQuery {
  query: {
    maintenanceStatusIds: string | undefined;
    buildingIds: string | undefined;
    categoryNames: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    filterBy: string;
  };
}

export interface IMaintenancesData {
  id: string;
  maintenanceHistoryId: string;
  buildingName: string;
  categoryName: string;
  element: string;
  source: string;
  maintenanceObservation: string | null;
  reportObservation: string | null;
  activity: string;
  responsible: string | null;
  notificationDate: Date;
  resolutionDate: Date | null;
  status: string;
  inProgress: boolean;
  cost: number | null;
  type: string | null;
  expectedDueDate?: Date;
  expectedNotificationDate?: Date;
  isFuture?: boolean;
  dueDate: Date;

  activities?: {
    title: string;
    content: string | null;
    type: string;
    createdAt: Date;
    images?: {
      name: string;
      url: string;
    }[];
  }[];

  images: {
    url: string;
  }[];

  annexes: {
    url: string;
    name: string;
  }[];
}
