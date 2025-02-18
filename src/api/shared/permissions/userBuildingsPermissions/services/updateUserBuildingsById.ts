import { prisma } from '../../../../../../prisma';

interface IUpdateUserBuildingsById {
  userId: string;
  buildingId: string;
  isMainContact: boolean;
  showContact: boolean;
}

export async function updateUserBuildingsById({
  userId,
  buildingId,
  isMainContact,
  showContact,
}: IUpdateUserBuildingsById) {
  await prisma.userBuildingsPermissions.update({
    where: {
      userId_buildingId: {
        userId,
        buildingId,
      },
    },
    data: {
      isMainContact,
      showContact,
    },
  });
}
