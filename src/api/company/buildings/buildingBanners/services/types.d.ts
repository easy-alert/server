export interface IChangeBuildingBanners {
  data: {
    buildingId: string;
    name: string;
    type: string;
    url: string;
    redirectUrl: string;
  }[];
}
