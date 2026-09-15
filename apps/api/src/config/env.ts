import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://mock-supabase.naagrik.internal',
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'mock-service-role-key-for-local-dev',
  
  JWT_SECRET: process.env.JWT_SECRET || 'naagrik_super_secret_jwt_key_2026_safe',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Cloudflare R2 Credentials (S3 Compatible API)
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || 'naagrik-media',
  R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL || 'https://pub-r2.naagrik.news',
  
  // Firebase Cloud Messaging
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || ''
};
