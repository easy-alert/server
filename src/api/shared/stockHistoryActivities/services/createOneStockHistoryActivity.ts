import { prisma } from '../../../../../prisma';

import { findUserById } from '../../users/user/services/findUserById';

interface IImage {
  originalName: string;
  url: string;
}

interface ICreateOneStockHistoryActivity {
  stockId: string;
  userId: string | undefined;
  activityContent: string;
  activityImages: IImage[] | undefined;
  type?: 'comment' | 'notification';
}

export async function createOneStockHistoryActivity({
  stockId,
  userId,
  activityContent,
  activityImages,
  type = 'comment',
}: ICreateOneStockHistoryActivity) {
  let author = 'Convidado';

  if (userId) {
    const user = await findUserById(userId);

    if (user) {
      author = user.name;
    }
  }

  const title =
    type === 'comment' ? `Nova atividade de ${author}` : `Nova notificação de ${author}`;

  return prisma.stockHistoryActivities.create({
    data: {
      stockId,
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
