export interface ICreateBuildingCategory {
  buildingId: string;
  categoryId: string;
  Maintenances: {
    createMany: {
      data: { maintenanceId: string }[];
    };
  };
}
