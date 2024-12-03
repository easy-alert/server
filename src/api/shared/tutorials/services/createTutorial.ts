import { prisma, prismaTypes } from '../../../../../prisma';

export async function createTutorial({
  title,
  description,
  url,
  thumbnail,
  type,
  order,
}: prismaTypes.TutorialCreateInput) {
  const createTutorialResponse = await prisma.tutorial.create({
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
