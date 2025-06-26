import type { PlatformVideoType } from '@prisma/client';
import { prisma } from '../../../../../prisma';

interface IFindManyPlatformVideo {
  type?: PlatformVideoType;
}

export async function findManyTutorials({ type }: IFindManyPlatformVideo) {
  const tutorials = await prisma.platformVideo.findMany({
    where: {
      type,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return tutorials;
}
