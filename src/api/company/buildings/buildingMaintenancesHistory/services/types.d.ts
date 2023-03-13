export interface ICreateBuildingCategory {
  buildingId: string;
  categoryId: string;
  Maintenances: {
    createMany: {
      data: { maintenanceId: string }[];
    };
  };
}

export interface IDeletePendingMaintenancesHistory {
  maintenancesIds: string[];
  buildingId: string;
}
