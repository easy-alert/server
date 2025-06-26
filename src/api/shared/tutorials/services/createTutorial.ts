import { prisma, prismaTypes } from '../../../../../prisma';

export async function createTutorial({
  title,
  description,
  url,
  thumbnail,
  type,
  order,
}: prismaTypes.PlatformVideoCreateInput) {
  const createTutorialResponse = await prisma.platformVideo.create({
    data: {
      title,
      description,
      url,
      thumbnail,
      type,
      order,
    },
  });

  return createTutorialResponse;
}
