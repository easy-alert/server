import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { sendErrorToServerLog } from '../messages/sendErrorToServerLog';

// Factory for S3 upload errors (no class)
export function makeS3UploadError(message: string, code = 'S3_UPLOAD_ERROR', extra?: any) {
  const err = new Error(message);
  (err as any).code = code;

  if (extra) (err as any).extra = extra;

  return err;
}

export async function uploadPDFToS3({
  pdfBuffer,
  filename,
}: {
  pdfBuffer: Buffer;
  filename: string;
}) {
  const s3bucket = new S3Client({
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    },
    region: 'us-west-2',
  });

  try {
    await s3bucket.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: filename,
        Body: pdfBuffer,
        ACL: 'public-read',
        ContentType: 'application/pdf',
      }),
    );
  } catch (error: any) {
    sendErrorToServerLog({ stack: error, extraInfo: { filename, error } });

    throw makeS3UploadError(
      error?.message || 'Erro ao fazer upload do PDF para o S3',
      error?.code || 'S3_UPLOAD_ERROR',
      { filename, error },
    );
  }
}
