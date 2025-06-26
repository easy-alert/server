import { prisma, prismaTypes } from '../../../../../prisma';

export async function updateOneTutorial({
  id,
  title,
  description,
  url,
  thumbnail,
  type,
  order,
}: prismaTypes.PlatformVideoCreateInput) {
  const updatedTutorial = await prisma.platformVideo.update({
    where: {
      id,
    },

    data: {
      title,
      description,
      url,
      thumbnail,
      type,
      order,
    },
  });

  return updatedTutorial;
}
