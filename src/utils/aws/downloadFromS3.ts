import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getBucketForUrl } from './s3Config';

import { sendErrorToServerLog } from '../messages/sendErrorToServerLog';

// Factory for S3 download errors (no class)
export function makeS3DownloadError(message: string, code = 'S3_DOWNLOAD_ERROR', extra?: any) {
  const err = new Error(message);
  (err as any).code = code;

  if (extra) (err as any).extra = extra;

  return err;
}

export async function downloadFromS3(url: string, folderName: string) {
  const key = url.split('/').pop() ?? '';
  const filePath = path.join(folderName, key);

  const s3bucket = getS3Client();
  const s3Params = {
    Bucket: getBucketForUrl(url),
    Key: key ? decodeURIComponent(key) : '',
  };

  try {
    const { Body } = (await s3bucket.send(new GetObjectCommand(s3Params))) as { Body: Readable };

    if (!Body) {
      const errMsg = `S3 Body missing for key: ${key} (url: ${url})`;

      sendErrorToServerLog({ stack: errMsg, extraInfo: { url, key, s3Params } });

      throw makeS3DownloadError('Falha ao obter o arquivo do S3', 'S3_BODY_MISSING', {
        url,
        key,
        s3Params,
      });
    }

    await new Promise<void>((resolve, reject) => {
      Body.pipe(fs.createWriteStream(filePath))
        .on('error', (err: any) => reject(err))
        .on('close', () => resolve());
    });

    return key;
  } catch (error: any) {
    sendErrorToServerLog({ stack: error, extraInfo: { url, key, s3Params } });

    throw makeS3DownloadError(
      error?.message || 'Erro ao baixar arquivo do S3',
      error?.code || 'S3_GET_OBJECT_ERROR',
      { url, key, s3Params },
    );
  }
}
