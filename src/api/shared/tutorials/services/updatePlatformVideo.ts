import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdatePlatformVideo {
  data: prismaTypes.PlatformVideoUpdateArgs;
}

export async function updatePlatformVideo<T>({ data }: IUpdatePlatformVideo): Promise<T | null> {
  const result = await prisma.platformVideo.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
