import { S3Client } from '@aws-sdk/client-s3';
import { ENV } from './env';

export const isR2Configured = (): boolean => {
  return Boolean(ENV.R2_ACCOUNT_ID && ENV.R2_ACCESS_KEY_ID && ENV.R2_SECRET_ACCESS_KEY);
};

// S3Client configured specifically for Cloudflare R2 S3-Compatible Endpoint
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: isR2Configured() 
    ? `https://${ENV.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` 
    : 'https://r2-mock.local',
  credentials: {
    accessKeyId: ENV.R2_ACCESS_KEY_ID || 'mock_key',
    secretAccessKey: ENV.R2_SECRET_ACCESS_KEY || 'mock_secret'
  }
});
