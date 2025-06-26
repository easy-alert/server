import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyPlatformVideos {
  data: prismaTypes.PlatformVideoFindManyArgs;
}

export async function findManyPlatformVideos<T>({
  data,
}: IFindManyPlatformVideos): Promise<T | null> {
  return prisma.platformVideo.findMany(data) as Promise<T | null>;
}
