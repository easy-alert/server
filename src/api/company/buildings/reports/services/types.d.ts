interface IQuery {
  maintenanceStatusIds: string[] | undefined;
  maintenanceStatusNames: string[] | undefined;
  buildingIds: string[] | undefined;
  buildingNames: string[] | undefined;
  categoryNames: string[] | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  filterBy: string;
  search?: string;
  type?: string[];
}

interface IQueryFilter {
  maintenanceStatusIds: string[] | undefined;
  buildingIds: string[] | undefined;
  categoryNames: string[] | undefined;
  dateFilter: { gte: Date; lte: Date };
  filterBy: string;
  search?: string;
  type?: string[];
}

export interface IFindBuildingMaintenancesHistory {
  companyId: string;
  queryFilter: IQueryFilter;
}

export interface IListForBuildingReportQuery {
  query: IQuery;
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
  serviceOrderNumber?: number | null;

  priority?: {
    label: string;
    color: string;
    backgroundColor: string;
  };

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
