import type { Request, Response } from 'express';

import { findManyPlatformVideos } from '../../../shared/platformVideos/services/findManyPlatformVideos';

interface PlatformVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  youtubeId: string;
  thumbnail: string;
  publishedAt: Date;
}

export async function getLastFeaturePlatformVideoController(_req: Request, res: Response) {
  const lastPlatformVideo = await findManyPlatformVideos<PlatformVideo[]>({
    data: {
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        youtubeId: true,
        thumbnail: true,
        publishedAt: true,
      },

      where: {
        type: 'feature',
      },

      orderBy: {
        publishedAt: 'desc',
      },

      take: 1,
    },
  });

  return res.status(200).json(lastPlatformVideo?.[0] || {});
}
