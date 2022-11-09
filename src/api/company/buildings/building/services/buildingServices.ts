// #region IMPORTS
import { prisma } from '../../../../../utils/prismaClient';

// TYPES
import { ICreateBulding, IListBuildings } from './types';

// // CLASS
// import { Validator } from '../../../../../utils/validator/validator';

// const validator = new Validator();

// #endregion

export class BuildingServices {
  async create({ data }: ICreateBulding) {
    await prisma.building.create({
      data,
    });
  }

  async list({ take = 20, page, search = '', companyId }: IListBuildings) {
    const [Buildings, buildingsCount] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
          state: true,
          neighborhood: true,
          streetName: true,
          area: true,
          cep: true,
          city: true,
          deliveryDate: true,
          warrantyExpiration: true,
          keepNotificationAfterWarrantyEnds: true,
          BuildingType: {
            select: {
              name: true,
            },
          },
        },
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          companyId,
        },
        orderBy: {
          name: 'asc',
        },

        take,
        skip: (page - 1) * take,
      }),

      prisma.building.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          companyId,
        },
      }),
    ]);

    return { Buildings, buildingsCount };
  }
}
