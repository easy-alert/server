export interface IChangeBuildingBanners {
  data: {
    buildingId: string;
    bannerName: string;
    originalName: string;
    type: string;
    url: string;
    redirectUrl: string;
  }[];
}
