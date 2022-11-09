// #region IMPORTS
import { prisma } from '../../../../../utils/prismaClient';

// TYPES
import { ICreateBuildingNotificationConfiguration } from './types';

// // CLASS
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

// #endregion

export class BuildingNotificationConfigurationServices {
  async create({ data }: ICreateBuildingNotificationConfiguration) {
    await prisma.buildingNotificationConfiguration.create({
      data,
    });
  }

  async findByEmail({
    email,
    buildingId,
  }: {
    email: string;
    buildingId: string;
  }) {
    const notification =
      await prisma.buildingNotificationConfiguration.findFirst({
        where: {
          email,
          buildingId,
        },
      });

    validator.cannotExists([
      {
        label: 'E-mail para notificão',
        variable: notification,
      },
    ]);
  }

  async findByContactNumber({
    contactNumber,
    buildingId,
  }: {
    contactNumber: string;
    buildingId: string;
  }) {
    const notification =
      await prisma.buildingNotificationConfiguration.findFirst({
        where: {
          contactNumber,
          buildingId,
        },
      });

    validator.cannotExists([
      {
        label: 'Telefone para notificão',
        variable: notification,
      },
    ]);
  }

  // async edit({ buildingId, data }: IEditBuilding) {
  //   await prisma.building.update({
  //     data,
  //     where: {
  //       id: buildingId,
  //     },
  //   });
  // }

  // async delete({ buildingId }: { buildingId: string }) {
  //   await prisma.building.delete({
  //     where: {
  //       id: buildingId,
  //     },
  //   });
  // }

  // async findById({ buildingId }: { buildingId: string }) {
  //   const building = await prisma.building.findUnique({
  //     where: {
  //       id: buildingId,
  //     },
  //   });

  //   validator.needExist([{ label: 'Edificação', variable: building }]);

  //   return building;
  // }

  // async list({ take = 20, page, search = '', companyId }: IListBuildings) {
  //   const [Buildings, buildingsCount] = await prisma.$transaction([
  //     prisma.building.findMany({
  //       select: {
  //         id: true,
  //         name: true,
  //         neighborhood: true,
  //         city: true,
  //       },
  //       where: {
  //         name: {
  //           contains: search,
  //           mode: 'insensitive',
  //         },
  //         companyId,
  //       },
  //       orderBy: {
  //         name: 'asc',
  //       },

  //       take,
  //       skip: (page - 1) * take,
  //     }),

  //     prisma.building.count({
  //       where: {
  //         name: {
  //           contains: search,
  //           mode: 'insensitive',
  //         },
  //         companyId,
  //       },
  //     }),
  //   ]);

  //   return { Buildings, buildingsCount };
  // }

  // async listDetails({ buildingId }: { buildingId: string }) {
  //   return prisma.building.findUnique({
  //     select: {
  //       id: true,
  //       name: true,
  //       cep: true,
  //       city: true,
  //       state: true,
  //       neighborhood: true,
  //       streetName: true,
  //       area: true,
  //       deliveryDate: true,
  //       warrantyExpiration: true,
  //       keepNotificationAfterWarrantyEnds: true,
  //       BuildingType: {
  //         select: {
  //           name: true,
  //         },
  //       },
  //     },
  //     where: {
  //       id: buildingId,
  //     },
  //   });
  // }
}
