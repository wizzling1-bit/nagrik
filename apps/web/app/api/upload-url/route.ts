import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { supabase } from '@/lib/supabase';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nagrik-media';
const R2_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || 'https://pub-421d616c2d3b4a94a05ad9bcbcb00380.r2.dev';

const ALLOWED_FOLDERS = new Set(['images', 'videos', 'thumbnails', 'profiles']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov']);

export async function POST(req: Request) {
  try {
    // 1. Authenticate caller session via Supabase JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to generate upload URL' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired user session' },
        { status: 401 }
      );
    }

    // 2. Validate R2 credentials configured
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { success: false, error: 'Cloudflare R2 storage credentials are not configured on server' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawFolder = body.folder || 'videos';
    const mimeType = body.mimeType || 'video/mp4';
    const rawExt = (body.fileExtension || 'mp4').toLowerCase().replace(/^\./, '').replace(/[^a-z0-9]/g, '');

    // 3. Validate folder, mimeType, and extension
    if (!ALLOWED_FOLDERS.has(rawFolder)) {
      return NextResponse.json(
        { success: false, error: `Invalid storage folder: ${rawFolder}` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { success: false, error: `Disallowed media type: ${mimeType}` },
        { status: 400 }
      );
    }

    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { success: false, error: `Disallowed file extension: .${rawExt}` },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const key = `media/${rawFolder}/${timestamp}-${randomSuffix}.${rawExt}`;
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${key}`;

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    return NextResponse.json({
      success: true,
      uploadUrl,
      mediaUrl: publicUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
