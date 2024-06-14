import 'dotenv/config';
import aws from 'aws-sdk';
import path from 'path';
import multer from 'multer';
import s3Storage from 'multer-sharp-s3';
import { Response, Request, NextFunction } from 'express';
import { ServerMessage } from '../../../utils/messages/serverMessage';

export async function uploadMany(req: Request, res: Response, next: NextFunction) {
  const s3bucket = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2',
  });

  const fileUpload = multer({
    storage: s3Storage({
      s3: s3bucket,
      Bucket: process.env.AWS_S3_BUCKET,
      ACL: 'public-read',
      withMetadata: true,
      Key(_req: Request, file: any, cb: any) {
        cb(
          null,
          `${path.basename(
            file.originalname,
            path.extname(file.originalname),
          )}-${Date.now()}${path.extname(file.originalname)}`,
        );
      },
    }),
  }).array('files');

  fileUpload(req, res, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return next(
        new ServerMessage({
          statusCode: 400,
          message: 'Erro ao efetuar upload do arquivo.',
        }),
      );
    }
    if (req.files === undefined || req.files.length === 0) {
      return next(
        new ServerMessage({
          statusCode: 400,
          message: 'Nenhum arquivo foi enviado.',
        }),
      );
    }
    return res.status(200).json(req.files);
  });
}
