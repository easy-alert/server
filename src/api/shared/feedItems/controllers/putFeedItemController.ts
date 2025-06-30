import type { Request, Response } from 'express';
import type { FeedItem } from '@prisma/client';

import { updateFeedItem } from '../services/updateFeedItem';

export async function putFeedItemController(req: Request, res: Response) {
  const { id } = req.params;

  const {
    title,
    description,
    imageUrl,
    videoUrl,
    ctaLink,
    ctaText,
    type,
    isPinned,
    order,
    startsAt,
    expiresAt,
  } = req.body as FeedItem;

  const platformVideo = updateFeedItem({
    data: {
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        ctaLink,
        ctaText,
        type,
        isPinned: isPinned || false,
        order: order || 1,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    },
  });

  return res
    .status(200)
    .json({ platformVideo, ServerMessage: { message: 'Notícia foi atualizado com sucesso!' } });
}
