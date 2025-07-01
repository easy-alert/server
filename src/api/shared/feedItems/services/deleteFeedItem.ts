import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeleteFeedItem {
  data: prismaTypes.FeedItemDeleteArgs;
}

export async function deleteFeedItem<T>({ data }: IDeleteFeedItem): Promise<T | null> {
  const result = await prisma.feedItem.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
