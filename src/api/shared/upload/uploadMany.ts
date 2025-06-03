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

const s3 = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
}).array('files');

export async function uploadMany(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  upload(req, res, async (err) => {
    const duration = Date.now() - start;

    if (err) {
      console.error(`[UPLOAD ERROR] ${err} | Duration: ${duration}ms`);

      return next(
        new ServerMessage({
          statusCode: 400,
          message: 'Erro ao efetuar upload do arquivo.',
        }),
      );
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
          const fileName = `${path.basename(
            file.originalname,
            path.extname(file.originalname),
          )}-${Date.now()}${path.extname(file.originalname)}`;

          const params = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: ObjectCannedACL.public_read,
            ServerSideEncryption: ServerSideEncryption.AES256,
          };

          await s3.send(new PutObjectCommand(params));
          const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${
            process.env.AWS_REGION || 'us-west-2'
          }.amazonaws.com/${fileName}`;

          return {
            originalname: file.originalname,
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
