export interface IBuildingChangeBanner {
  data: {
    buildingId: string;
    bannerName: string;
    originalName: string;
    type: string;
    url: string;
    redirectUrl: string;
  }[];
}
