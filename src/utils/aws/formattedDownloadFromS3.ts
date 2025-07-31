import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import sharp from 'sharp';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { loadEsm } from 'load-esm';
import { getS3Client, getBucketForUrl } from './s3Config';

import { sendErrorToServerLog } from '../messages/sendErrorToServerLog';

// Factory for S3 download errors (no class)
export function makeS3DownloadError(message: string, code = 'S3_DOWNLOAD_ERROR', extra?: any) {
  const err = new Error(message);
  (err as any).code = code;

  if (extra) (err as any).extra = extra;

  return err;
}

interface DownloadS3Options {
  url: string;
  folderName: string;
  targetFormat?: 'png' | 'jpeg'; // Optional target format for images
}

export async function formattedDownloadFromS3({
  url,
  folderName,
  targetFormat,
}: DownloadS3Options) {
  const key = url.split('/').pop() ?? '';
  const filePath = path.join(folderName, key);

  const s3bucket = getS3Client();
  const s3Params = {
    Bucket: getBucketForUrl(url),
    Key: key ? decodeURIComponent(key) : '',
  };

  try {
    const { Body } = (await s3bucket.send(new GetObjectCommand(s3Params))) as { Body: Readable };
    const { fileTypeFromBuffer } = await loadEsm<typeof import('file-type')>('file-type');

    if (!Body) {
      const errMsg = `S3 Body missing for key: ${key} (url: ${url})`;
      sendErrorToServerLog({ stack: errMsg, extraInfo: { url, key, s3Params } });
      throw makeS3DownloadError('Falha ao obter o arquivo do S3', 'S3_BODY_MISSING', {
        url,
        key,
        s3Params,
      });
    }

    // Convert stream to buffer
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      Body.on('data', (chunk) => chunks.push(chunk));
      Body.on('end', () => resolve(Buffer.concat(chunks)));
      Body.on('error', reject);
    });

    // Check if it's an image
    const fileTypeResult = await fileTypeFromBuffer(buffer);
    if (fileTypeResult) {
      // Validate image format
      const imageMetadata = await sharp(buffer).metadata();

      // Handle WebP and other unsupported formats
      if (
        imageMetadata.format === 'webp' ||
        !['jpeg', 'png'].includes(imageMetadata.format || '')
      ) {
        if (!targetFormat) {
          throw makeS3DownloadError(
            `Formato de imagem não suportado: ${imageMetadata.format}. Use targetFormat para especificar um formato de saída.`,
            'UNSUPPORTED_IMAGE_FORMAT',
          );
        }

        // Convert to target format in memory
        const convertedBuffer = await sharp(buffer)
          .rotate()
          .resize({ width: 400, height: 400, fit: 'inside' })
          .toFormat(targetFormat)
          .toBuffer();

        // Write converted buffer to file
        await fs.promises.writeFile(filePath, convertedBuffer);
      } else {
        // Write original buffer to file for supported formats
        await fs.promises.writeFile(filePath, buffer);
      }
    } else {
      // Write non-image file directly
      await fs.promises.writeFile(filePath, buffer);
    }

    return filePath;
  } catch (error) {
    if (error instanceof Error) {
      sendErrorToServerLog({ stack: error.stack, extraInfo: { url, key, s3Params } });
    }
    throw error;
  }
}
