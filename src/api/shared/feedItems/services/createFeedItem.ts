import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreateFeedItem {
  data: prismaTypes.FeedItemCreateArgs;
}

export async function createFeedItem<T>({ data }: ICreateFeedItem): Promise<T | null> {
  const result = await prisma.feedItem.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
