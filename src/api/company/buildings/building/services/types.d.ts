export interface ICreateBulding {
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
