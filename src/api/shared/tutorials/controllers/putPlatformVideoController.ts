import type { Request, Response } from 'express';
import type { PlatformVideo } from '@prisma/client';

import { updatePlatformVideo } from '../services/updatePlatformVideo';

export async function putPlatformVideoController(req: Request, res: Response) {
  const { id } = req.params;

  const { title, description, url, youtubeId, thumbnail, type, status, order, publishedAt, tags } =
    req.body as PlatformVideo;

  const platformVideo = updatePlatformVideo({
    data: {
      where: { id },
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

  return res
    .status(200)
    .json({ platformVideo, ServerMessage: { message: 'Tutorial foi atualizado com sucesso!' } });
}
