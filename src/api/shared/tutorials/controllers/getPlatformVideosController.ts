import type { Request, Response } from 'express';
import type { PlatformVideoStatus, PlatformVideoType } from '@prisma/client';

import { findManyPlatformVideos } from '../services/findManyPlatformVideos';

export async function getPlatformVideosController(req: Request, res: Response) {
  const { type, status } = req.query as {
    type?: PlatformVideoType;
    status?: PlatformVideoStatus;
  };

  const platformVideos = await findManyPlatformVideos({
    data: {
      where: {
        type: type ? { equals: type } : undefined,
        status: status ? { equals: status } : undefined,
      },

      orderBy: [
        { type: 'asc' }, // Then by type ascending
        { status: 'desc' }, // Order by creation date descending
        { publishedAt: 'asc' }, // Then by title ascending
        { order: 'asc' }, // Then by order ascending
      ],
    },
  });

  return res.status(200).json({
    platformVideos,
  });
}
