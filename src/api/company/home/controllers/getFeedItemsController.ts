import type { Request, Response } from 'express';

import { findManyFeedItems } from '../../../shared/feedItems/services/findManyFeedItems';

interface IFeedItem {
  id: string;
  isPinned: boolean;
  order: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export async function getFeedItemsController(_req: Request, res: Response) {
  const now = new Date(); // Or the current user's local time if timezones matter

  const feedItems = await findManyFeedItems<IFeedItem[]>({
    data: {
      where: {
        AND: [
          {
            OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          },
          {
            OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
          },
        ],
      },
      orderBy: [{ isPinned: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    },
  });

  return res.status(200).json(feedItems);
}
