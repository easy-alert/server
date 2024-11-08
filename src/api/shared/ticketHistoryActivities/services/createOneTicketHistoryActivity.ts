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
}

export async function createOneTicketHistoryActivity({
  ticketId,
  syndicNanoId,
  userId,
  activityContent,
  activityImages,
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

  return prisma.ticketHistoryActivities.create({
    data: {
      ticketId,
      title: `Nova atividade de ${author}`,
      content: activityContent?.trim() ? activityContent : null,
      type: 'comment',

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
