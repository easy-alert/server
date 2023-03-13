export interface IFindBuildingMaintenancesHistory {
  companyId: string;
  queryFilter: {
    maintenanceStatusId: string | undefined;
    buildingId: string | undefined;
    categoryId: string | undefined;
    responsibleSyndicId: string | undefined;
    dateFilter: any;
  };
}

export interface IListForBuildingReportQuery {
  query: {
    maintenanceStatusId: string | undefined;
    buildingId: string | undefined;
    categoryId: string | undefined;
    responsibleSyndicId: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  };
}

export interface IMaintenancesData {
  maintenanceHistoryId: string;
  buildingName: string;
  categoryName: string;
  element: string;
  activity: string;
  responsible: string | null;
  notificationDate: Date;
  resolutionDate: Date | null;
  status: string;
  cost: number | null;
}
