import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateFeedItem {
  data: prismaTypes.FeedItemUpdateArgs;
}

export async function updateFeedItem<T>({ data }: IUpdateFeedItem): Promise<T | null> {
  const result = await prisma.feedItem.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
