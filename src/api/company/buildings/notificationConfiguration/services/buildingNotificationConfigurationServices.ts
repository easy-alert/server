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

  // #region FINDS

  async findById({
    buildingNotificationConfigurationId,
  }: {
    buildingNotificationConfigurationId: string;
  }) {
    const buildingConfigurationNotification =
      await prisma.buildingNotificationConfiguration.findUnique({
        where: {
          id: buildingNotificationConfigurationId,
        },
      });

    validator.needExist([
      {
        label: 'Configuração de notificação',
        variable: buildingConfigurationNotification,
      },
    ]);

    return buildingConfigurationNotification;
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

  async findByEmailForEdit({
    email,
    buildingId,
    buildingNotificationConfigurationId,
  }: {
    email: string;
    buildingId: string;
    buildingNotificationConfigurationId: string;
  }) {
    const notification =
      await prisma.buildingNotificationConfiguration.findFirst({
        where: {
          email,
          buildingId,
          NOT: {
            id: buildingNotificationConfigurationId,
          },
        },
      });

    validator.cannotExists([
      {
        label: 'E-mail para notificão',
        variable: notification,
      },
    ]);
  }

  async findByContactNumberForEdit({
    contactNumber,
    buildingId,
    buildingNotificationConfigurationId,
  }: {
    contactNumber: string;
    buildingId: string;
    buildingNotificationConfigurationId: string;
  }) {
    const notification =
      await prisma.buildingNotificationConfiguration.findFirst({
        where: {
          contactNumber,
          buildingId,
          NOT: {
            id: buildingNotificationConfigurationId,
          },
        },
      });

    validator.cannotExists([
      {
        label: 'Telefone para notificão',
        variable: notification,
      },
    ]);
  }

  async findNotificationConfigurationMainForCreate({
    buildingId,
  }: {
    buildingId: string;
  }) {
    return prisma.buildingNotificationConfiguration.findFirst({
      where: {
        buildingId,
        isMain: true,
      },
    });
  }

  async findNotificationConfigurationMainForEdit({
    buildingNotificationConfigurationId,
    buildingId,
  }: {
    buildingNotificationConfigurationId: string;
    buildingId: string;
  }) {
    return prisma.buildingNotificationConfiguration.findFirst({
      where: {
        buildingId,
        isMain: true,

        NOT: {
          id: buildingNotificationConfigurationId,
        },
      },
    });
  }

  // #endregion

  async delete({
    buildingNotificationConfigurationId,
  }: {
    buildingNotificationConfigurationId: string;
  }) {
    await prisma.buildingNotificationConfiguration.delete({
      where: {
        id: buildingNotificationConfigurationId,
      },
    });
  }
}
