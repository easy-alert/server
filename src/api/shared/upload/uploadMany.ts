import { Response, Request, NextFunction } from 'express';

import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  ServerSideEncryption,
} from '@aws-sdk/client-s3';

import multer from 'multer';
import path from 'path';
import 'dotenv/config';

import { ServerMessage } from '../../../utils/messages/serverMessage';
import { handleMulterError } from '../../../utils/messages/handleMulterError';
import { simplifyNameForURL } from '../../../utils/dataHandler';

const s3 = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const fileSizeLimit = process.env.FILE_SIZE_LIMIT;
const fileSize = (Number(fileSizeLimit) || 10) * 1024 * 1024; // Default to 10MB if not set

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize }, // 10MB
}).array('files');

export async function uploadMany(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  upload(req, res, async (err) => {
    const duration = Date.now() - start;

    if (err instanceof multer.MulterError) {
      return next(handleMulterError(err, duration));
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      console.warn(`[UPLOAD WARNING] No file sent | Duration: ${duration}ms`);

      return next(
        new ServerMessage({
          statusCode: 400,
          message: 'Nenhum arquivo foi enviado.',
        }),
      );
    }

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const sanitizedName = simplifyNameForURL(
            path.basename(originalName, path.extname(originalName)),
          );
          const fileName = `${sanitizedName}-${Date.now()}${path.extname(originalName)}`;

          const params = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: ObjectCannedACL.public_read,
            ServerSideEncryption: ServerSideEncryption.AES256,
            ContentDisposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
            ContentEncoding: 'utf-8',
          };

          await s3.send(new PutObjectCommand(params));
          const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${
            process.env.AWS_REGION || 'us-west-2'
          }.amazonaws.com/${fileName}`;

          return {
            originalname: originalName,
            Location: fileUrl,
          };
        }),
      );

      return res.status(200).json(results);
    } catch (error) {
      console.error(`[UPLOAD ERROR] ${error} | Duration: ${duration}ms`);
      return next(
        new ServerMessage({
          statusCode: 500,
          message: 'Erro ao salvar arquivos no S3.',
        }),
      );
    }
  });
}
