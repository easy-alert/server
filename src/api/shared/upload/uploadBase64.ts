import { Response, Request } from 'express';

import aws from 'aws-sdk';

import 'dotenv/config';
import { ServerMessage } from '../../../utils/messages/serverMessage';

export async function uploadBase64(req: Request, res: Response) {
  const { originalname, file } = req.body;

  const base64Data = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  if (!process.env.AWS_S3_BUCKET) {
    return new ServerMessage({
      statusCode: 400,
      message: 'Erro ao efetuar upload do arquivo.',
    });
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: originalname,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: 'image/png',
    ACL: 'public-read',
  };

  const s3bucket = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-west-2',
  });

  try {
    const data = await s3bucket.upload(params).promise();

    return res.status(200).json({ location: data.Location });
  } catch (err: any) {
    return new ServerMessage({
      statusCode: 400,
      message: 'Erro ao efetuar upload do arquivo.',
    });
  }
}
