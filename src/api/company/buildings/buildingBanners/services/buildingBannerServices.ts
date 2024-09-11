import { prisma, prismaTypes } from '../../../../../../prisma';
import { needExist } from '../../../../../utils/newValidator';

export class BuildingBannerServices {
  async create(data: prismaTypes.BuildingBannersUncheckedCreateInput) {
    await prisma.buildingBanners.create({ data });
  }

  async update(args: prismaTypes.BuildingBannersUpdateArgs) {
    await this.findById(args.where.id || '');

    await prisma.buildingBanners.update(args);
  }

  async delete(id: string) {
    await this.findById(id);

    await prisma.buildingBanners.delete({ where: { id } });
  }

  async findById(id: string) {
    const banner = await prisma.buildingBanners.findUnique({ where: { id } });

    needExist([{ label: 'Banner', variable: banner }]);

    return banner!;
  }
}
