import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB max

export async function POST(req: Request) {
  try {
    // 1. Authenticate caller session via Supabase JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to upload media' },
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

    // 2. Verify R2 credentials configured
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { success: false, error: 'Cloudflare R2 storage credentials are not configured on server' },
        { status: 500 }
      );
    }

    // 3. Process multipart form payload
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rawFolder = (formData.get('folder') as string) || 'videos';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the maximum allowed limit of 100MB` },
        { status: 413 }
      );
    }

    // 5. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: `Disallowed media type: ${file.type || 'unknown'}` },
        { status: 400 }
      );
    }

    // 6. Validate file extension
    const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `Disallowed file extension: .${ext}` },
        { status: 400 }
      );
    }

    // 7. Sanitize folder path
    const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : 'videos';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const key = `media/${folder}/${timestamp}-${randomSuffix}.${ext}`;
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${key}`;

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({
      success: true,
      publicUrl,
      mediaUrl: publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Direct R2 upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file to Cloudflare R2' },
      { status: 500 }
    );
  }
}
