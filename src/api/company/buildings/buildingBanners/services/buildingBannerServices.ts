import { prisma } from '../../../../../../prisma';
import { IChangeBuildingBanners } from './types';

export class BuildingBannerServices {
  async changeBanners({ data }: IChangeBuildingBanners) {
    const [BuildingBanners] = await prisma.$transaction([
      prisma.buildingBanners.deleteMany({
        where: {
          buildingId: data[0].buildingId,
        },
      }),

      prisma.buildingBanners.createMany({
        data,
      }),
    ]);

    return { BuildingBanners };
  }
}
