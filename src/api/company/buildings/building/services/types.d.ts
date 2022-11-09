export interface ICreateBulding {
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

export interface IListBuildings {
  take?: number;
  page: number;
  search: string;
  companyId: string;
}
