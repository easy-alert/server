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
