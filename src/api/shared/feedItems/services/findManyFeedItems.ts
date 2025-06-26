import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyFeedItems {
  data: prismaTypes.FeedItemFindManyArgs;
}

export async function findManyFeedItems<T>({ data }: IFindManyFeedItems): Promise<T | null> {
  return prisma.feedItem.findMany(data) as Promise<T | null>;
}
