import type { Request, Response } from 'express';
import type { FeedItemType } from '@prisma/client';

import { findManyFeedItems } from '../services/findManyFeedItems';

export async function getFeedItemsController(req: Request, res: Response) {
  const { type } = req.query as {
    type?: FeedItemType;
  };

  const now = new Date(); // Or the current user's local time if timezones matter

  const feedItems = await findManyFeedItems({
    data: {
      where: {
        type: type ? { equals: type } : undefined,

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

  return res.status(200).json({
    feedItems,
  });
}
