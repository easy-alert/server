export interface IChangeBuildingBanners {
  buildingId: string;
  data: {
    buildingId: string;
    bannerName: string;
    originalName: string;
    type: string;
    url: string;
    redirectUrl: string;
  }[];
}
