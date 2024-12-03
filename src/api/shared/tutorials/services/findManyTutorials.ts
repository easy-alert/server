import { prisma } from '../../../../../prisma';

interface IFindManyTutorials {
  type?: string;
}

export async function findManyTutorials({ type }: IFindManyTutorials) {
  const tutorials = await prisma.tutorial.findMany({
    where: {
      type,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return tutorials;
}
