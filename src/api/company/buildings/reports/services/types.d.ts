export interface IFindBuildingMaintenancesHistory {
  companyId: string;
  queryFilter: {
    maintenanceStatusIds: string[] | undefined;
    buildingIds: string[] | undefined;
    categoryIds: string[] | undefined;
    dateFilter: any;
  };
}

export interface IListForBuildingReportQuery {
  query: {
    maintenanceStatusIds: string | undefined;
    buildingIds: string | undefined;
    categoryIds: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  };
}

export interface IMaintenancesData {
  id: string;
  maintenanceHistoryId: string;
  buildingName: string;
  categoryName: string;
  element: string;
  observation: string | null;
  activity: string;
  responsible: string | null;
  notificationDate: Date;
  resolutionDate: Date | null;
  status: string;
  cost: number | null;
}
