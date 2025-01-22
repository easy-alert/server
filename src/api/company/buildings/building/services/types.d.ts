export interface ICreateBuilding {
  data: {
    buildingTypeId: string;
    companyId: string;
    name: string;
    cep: string;
    city: string;
    state: string;
    neighborhood: string;
    streetName: string;
    area: string;
    deliveryDate: Date;
    warrantyExpiration: Date;
    keepNotificationAfterWarrantyEnds: boolean;
    guestCanCompleteMaintenance: boolean;
  };
}

export interface IEditBuilding {
  buildingId: string;
  data: {
    buildingTypeId: string;
    name: string;
    cep: string;
    city: string;
    state: string;
    neighborhood: string;
    streetName: string;
    area: string;
    warrantyExpiration: Date;
    keepNotificationAfterWarrantyEnds: boolean;
    guestCanCompleteMaintenance: boolean;
  };
}

export interface IListBuildings {
  take?: number;
  page: number;
  search: string;
  companyId: string;
  buildingsIds?: string[];
}

export interface IListMaintenances {
  buildingId: string;
}
