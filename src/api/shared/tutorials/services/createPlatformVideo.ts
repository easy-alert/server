import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreatePlatformVideo {
  data: prismaTypes.PlatformVideoCreateArgs;
}

export async function createPlatformVideo<T>({ data }: ICreatePlatformVideo): Promise<T | null> {
  const result = await prisma.platformVideo.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
