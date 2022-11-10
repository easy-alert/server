export interface ICreateBuildingNotificationConfiguration {
  data: {
    buildingId: string;
    name: string;
    email: string;
    role: string;
    contactNumber: string;
    isMain: boolean;
  };
}

export interface IEditBuildingNotificationConfiguration {
  buildingNotificationConfigurationId: string;
  data: {
    name: string;
    email: string;
    role: string;
    contactNumber: string;
    isMain: boolean;
  };
}
