export interface IFindBuildingMaintenancesHistory {
  companyId: string;
  queryFilter: {
    maintenanceStatusIds: string[] | undefined;
    buildingIds: string[] | undefined;
    categoryNames: string[] | undefined;
    dateFilter: {
      notificationDate: { gte: Date; lte: Date };
      dueDate: { gte: Date | undefined; lte: Date | undefined };
    };
  };
}

export interface IListForBuildingReportQuery {
  query: {
    maintenanceStatusIds: string | undefined;
    buildingIds: string | undefined;
    categoryNames: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    startDueDate: string | undefined;
    endDueDate: string | undefined;
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

  images: {
    url: string;
  }[];

  annexes: {
    url: string;
    name: string;
  }[];
}
