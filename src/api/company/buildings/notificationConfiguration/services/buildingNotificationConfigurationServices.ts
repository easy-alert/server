// #region IMPORTS
import { prisma } from '../../../../../../prisma';

// TYPES
import {
  ICreateBuildingNotificationConfiguration,
  IEditBuildingNotificationConfiguration,
  ISendEmailConfirmationForReceiveNotifications,
  ISendWhatsappConfirmationForReceiveNotifications,
} from './types';

// // CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { ZenviaServices } from '../../../../../utils/customsApis/Zenvia/services/zenviaServices';

import { EmailTransporterServices } from '../../../../../utils/emailTransporter/emailTransporterServices';

const validator = new Validator();
const zenviaServices = new ZenviaServices();
const emailTransporter = new EmailTransporterServices();

// #endregion

export class BuildingNotificationConfigurationServices {
  async create({ data }: ICreateBuildingNotificationConfiguration) {
    return prisma.buildingNotificationConfiguration.create({
      data,
    });
  }

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

  async edit({
    buildingNotificationConfigurationId,
    data,
  }: IEditBuildingNotificationConfiguration) {
    return prisma.buildingNotificationConfiguration.update({
      data,
      where: { id: buildingNotificationConfigurationId },
    });
  }

  async editLastNotificationDate({
    buildingNotificationConfigurationId,
  }: {
    buildingNotificationConfigurationId: string;
  }) {
    await prisma.buildingNotificationConfiguration.update({
      data: {
        lastNotificationDate: new Date(),
      },

      where: {
        id: buildingNotificationConfigurationId,
      },
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

  async findByEmail({ email, buildingId }: { email: string; buildingId: string }) {
    const notification = await prisma.buildingNotificationConfiguration.findFirst({
      where: {
        email,
        buildingId,
      },
    });

    validator.cannotExists([
      {
        label: 'E-mail para notificação',
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
    const notification = await prisma.buildingNotificationConfiguration.findFirst({
      where: {
        contactNumber,
        buildingId,
      },
    });

    validator.cannotExists([
      {
        label: 'Telefone para notificação',
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
    const notification = await prisma.buildingNotificationConfiguration.findFirst({
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
        label: 'E-mail para notificação',
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
    const notification = await prisma.buildingNotificationConfiguration.findFirst({
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
        label: 'Telefone para notificação',
        variable: notification,
      },
    ]);
  }

  async findNotificationConfigurationMainForCreate({ buildingId }: { buildingId: string }) {
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

  // #region NOTIFICATIONS

  // SENDS

  async sendWhatsappConfirmationForReceiveNotifications({
    receiverPhoneNumber,
    link,
    buildingNotificationConfigurationId,
  }: ISendWhatsappConfirmationForReceiveNotifications) {
    await zenviaServices.postWhatsappConfirmation({
      receiverPhoneNumber,
      link,
    });

    await this.editLastNotificationDate({
      buildingNotificationConfigurationId,
    });
  }

  async sendEmailConfirmForReceiveNotifications({
    toEmail,
    link,
    buildingNotificationConfigurationId,
  }: ISendEmailConfirmationForReceiveNotifications) {
    await emailTransporter.sendEmail({
      toEmail,
      subject: 'Confirmação de e-mail',
      text: 'Você está recebendo esta mensagem pois seu email foi apontado como responsável por uma edificação!',
      template: 'confirmEmail',
      link,
    });

    await this.editLastNotificationDate({
      buildingNotificationConfigurationId,
    });
  }

  async confirmContactNumber({
    buildingNotificationConfigurationId,
  }: {
    buildingNotificationConfigurationId: string;
  }) {
    await prisma.buildingNotificationConfiguration.update({
      data: {
        contactNumberIsConfirmed: true,
      },

      where: {
        id: buildingNotificationConfigurationId,
      },
    });
  }

  // #endregion
}
