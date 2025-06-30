import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeletePlatformVideo {
  data: prismaTypes.PlatformVideoDeleteArgs;
}

export async function deletePlatformVideo<T>({ data }: IDeletePlatformVideo): Promise<T | null> {
  const result = await prisma.platformVideo.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
