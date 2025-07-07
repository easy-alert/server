// Central S3 config and helpers
import { S3Client } from '@aws-sdk/client-s3';

export const S3_REGION = process.env.AWS_REGION || 'us-west-2';
export const S3_MAIN_BUCKET = process.env.AWS_S3_BUCKET || 'easy-alert';

export function getS3Credentials() {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  };
}

export function getS3Client(region = S3_REGION) {
  return new S3Client({
    credentials: getS3Credentials(),
    region,
  });
}

export function getBucketForUrl(url: string): string {
  // Add more logic here if you support more buckets
  if (url.includes('larguei')) return S3_MAIN_BUCKET;
  return 'easy-alert';
}
