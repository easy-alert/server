import { Readable } from 'stream';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { sendErrorToServerLog } from '../messages/sendErrorToServerLog';

// Factory for S3 image errors (no class)
export function makeS3ImageError(message: string, code = 'S3_IMAGE_ERROR', extra?: any) {
  const err = new Error(message);
  (err as any).code = code;

  if (extra) (err as any).extra = extra;

  return err;
}

export async function getImageStreamFromS3(url: string): Promise<Readable> {
  const key = url.split('/').pop() ?? '';

  const s3bucket = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: 'us-west-2',
  });
  const s3Params = {
    Bucket: url.includes('larguei') ? process.env.AWS_S3_BUCKET! : 'easy-alert',
    Key: key ? decodeURIComponent(key) : '',
  };

  try {
    const { Body } = (await s3bucket.send(new GetObjectCommand(s3Params))) as { Body: Readable };

    if (!Body) {
      const errMsg = `S3 Body missing for key: ${key} (url: ${url})`;

      sendErrorToServerLog({ stack: errMsg, extraInfo: { url, key, s3Params } });

      throw makeS3ImageError('Falha ao obter a imagem do S3', 'S3_BODY_MISSING', {
        url,
        key,
        s3Params,
      });
    }

    return Body;
  } catch (error: any) {
    sendErrorToServerLog({ stack: error, extraInfo: { url, key, s3Params } });

    throw makeS3ImageError(
      error?.message || 'Erro ao buscar imagem no S3',
      error?.code || 'S3_GET_OBJECT_ERROR',
      { url, key, s3Params },
    );
  }
}
