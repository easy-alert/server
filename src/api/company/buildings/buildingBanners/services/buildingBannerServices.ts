import { prisma } from '../../../../../../prisma';
import { IChangeBuildingBanners } from './types';

export class BuildingBannerServices {
  async changeBanners({ buildingId, data }: IChangeBuildingBanners) {
    const [BuildingBanners] = await prisma.$transaction([
      prisma.buildingBanners.deleteMany({
        where: {
          buildingId,
        },
      }),

      prisma.buildingBanners.createMany({
        data,
      }),
    ]);

    return { BuildingBanners };
  }
}
