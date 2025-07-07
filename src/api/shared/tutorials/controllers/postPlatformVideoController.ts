import type { PlatformVideo } from '@prisma/client';
import type { Request, Response } from 'express';

import { createPlatformVideo } from '../services/createPlatformVideo';

export async function postPlatformVideoController(req: Request, res: Response) {
  const { title, description, url, youtubeId, thumbnail, type, status, order, publishedAt, tags } =
    req.body as PlatformVideo;

  const platformVideo = await createPlatformVideo({
    data: {
      data: {
        title,
        description,
        url,
        youtubeId,
        thumbnail,
        type,
        status,
        order,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        tags: tags || [],
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
