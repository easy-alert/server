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

interface IData {
  syndicNanoId: string | undefined;
  userId: string | undefined;
  maintenanceHistoryId: string;
  content: string | null;
  images?: IImage[];
}

export async function createMaintenanceHistoryActivityCommentService({
  userId,
  syndicNanoId,
  maintenanceHistoryId,
  content,
  images,
}: IData) {
  let author: string = 'Convidado';

  // Gambiarra, ver lá na modal
  if (syndicNanoId && syndicNanoId !== 'guest') {
    author = (await sharedBuildingNotificationConfigurationServices.findByNanoId({ syndicNanoId }))
      .name;
  }

  if (userId) {
    author = (await userServices.findById({ userId })).name;
  }

  return prisma.maintenanceHistoryActivity.create({
    data: {
      maintenanceHistoryId,
      content: content?.trim() ? content : null,
      title: `Nova atividade de ${author}`,
      type: 'comment',

      images: {
        createMany: {
          data: Array.isArray(images)
            ? images.map(({ originalName, url }) => ({
                name: originalName,
                url,
              }))
            : [],
        },
      },
    },
  });
}
