import { prisma } from '../../../../../prisma';

import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { UserServices } from '../../users/user/services/userServices';

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const userServices = new UserServices();

interface IImage {
  originalName: string;
  url: string;
}

interface ICreateOneTicketHistoryActivity {
  ticketId: string;
  syndicNanoId: string | undefined;
  userId: string | undefined;
  activityContent: string;
  activityImages: IImage[] | undefined;
  type?: 'comment' | 'notification';
}

export async function createOneTicketHistoryActivity({
  ticketId,
  syndicNanoId,
  userId,
  activityContent,
  activityImages,
  type = 'comment',
}: ICreateOneTicketHistoryActivity) {
  let author: string = 'Convidado';

  // Gambiarra, ver lá na modal
  if (syndicNanoId && syndicNanoId !== 'guest') {
    author = (await sharedBuildingNotificationConfigurationServices.findByNanoId({ syndicNanoId }))
      .name;
  }

  if (userId) {
    author = (await userServices.findById({ userId })).name;
  }

  const title =
    type === 'comment' ? `Nova atividade de ${author}` : `Nova notificação de ${author}`;

  return prisma.ticketHistoryActivities.create({
    data: {
      ticketId,
      title,
      content: activityContent?.trim() ? activityContent : null,
      type,

      images: {
        createMany: {
          data: Array.isArray(activityImages)
            ? activityImages.map(({ originalName, url }) => ({
                name: originalName,
                url,
              }))
            : [],
        },
      },
    },
  });
}
