import type { FeedItem } from '@prisma/client';
import type { Request, Response } from 'express';
import { createFeedItem } from '../services/createFeedItem';

export async function postFeedItemController(req: Request, res: Response) {
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

  const platformVideo = await createFeedItem({
    data: {
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

  return res.status(201).json({
    platformVideo,
    ServerMessage: {
      statusCode: 201,
      message: 'Tutorial cadastrado com sucesso.',
    },
  });
}
