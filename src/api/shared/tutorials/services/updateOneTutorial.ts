import { prisma, prismaTypes } from '../../../../../prisma';

export async function updateOneTutorial({
  id,
  title,
  description,
  url,
  thumbnail,
  type,
  order,
}: prismaTypes.TutorialCreateInput) {
  const updatedTutorial = await prisma.tutorial.update({
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
