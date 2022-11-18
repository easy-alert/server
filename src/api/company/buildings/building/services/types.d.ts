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
    deliveryDate: Date;
    warrantyExpiration: Date;
    keepNotificationAfterWarrantyEnds: boolean;
  };
}

export interface IListBuildings {
  take?: number;
  page: number;
  search: string;
  companyId: string;
}

export interface IListMaintenances {
  buildingId: string;
}
