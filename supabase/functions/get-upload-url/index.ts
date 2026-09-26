import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.650.0";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.650.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

const R2_ACCOUNT_ID = Deno.env.get("R2_ACCOUNT_ID");
const R2_ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID");
const R2_SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY");
const R2_BUCKET_NAME = Deno.env.get("R2_BUCKET_NAME") || "nagrik-media";
const R2_CUSTOM_CDN_DOMAIN = Deno.env.get("R2_CUSTOM_CDN_DOMAIN") || "https://media.nagrik.news";
const R2_PUBLIC_BASE_URL = Deno.env.get("R2_PUBLIC_BASE_URL") || R2_CUSTOM_CDN_DOMAIN;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

// Folder specific MIME types and max size quotas (bytes)
const FOLDER_CONSTRAINTS: Record<string, { mimes: string[]; maxSizeBytes: number; allowedExts: string[] }> = {
  videos: {
    mimes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSizeBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    allowedExts: ['mp4', 'webm', 'mov']
  },
  thumbnails: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedExts: ['jpg', 'jpeg', 'png', 'webp']
  },
  images: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeBytes: 20 * 1024 * 1024, // 20 MB
    allowedExts: ['jpg', 'jpeg', 'png', 'webp', 'gif']
  },
  avatars: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedExts: ['jpg', 'jpeg', 'png', 'webp']
  },
  profiles: {
    mimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedExts: ['jpg', 'jpeg', 'png', 'webp']
  },
  documents: {
    mimes: ['application/pdf'],
    maxSizeBytes: 20 * 1024 * 1024, // 20 MB
    allowedExts: ['pdf']
  }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate caller via Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing or invalid Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Token is empty' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid authentication session' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // 2. Validate R2 storage configuration
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'R2 storage credentials not configured on server' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const folder = (body.folder || 'videos').toLowerCase();
    const constraint = FOLDER_CONSTRAINTS[folder];

    if (!constraint) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid folder. Allowed: ${Object.keys(FOLDER_CONSTRAINTS).join(', ')}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const mimeType = (body.mimeType || 'video/mp4').toLowerCase();
    if (!constraint.mimes.includes(mimeType)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `MIME type '${mimeType}' not allowed for folder '${folder}'. Allowed: ${constraint.mimes.join(', ')}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const rawExt = (body.fileExtension || 'mp4').replace(/^\./, '').toLowerCase();
    if (!constraint.allowedExts.includes(rawExt)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `File extension '.${rawExt}' not allowed for folder '${folder}'. Allowed: ${constraint.allowedExts.join(', ')}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const fileSize = typeof body.fileSize === 'number' ? body.fileSize : undefined;
    if (fileSize && fileSize > constraint.maxSizeBytes) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `File size exceeds maximum allowed of ${Math.round(constraint.maxSizeBytes / (1024 * 1024))}MB for folder '${folder}'` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      }
    });

    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const key = `media/${folder}/${randomHex}.${rawExt}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Metadata: {
        'uploader-id': user.id,
        'folder': folder,
        'uploaded-at': new Date().toISOString()
      }
    });

    // Short-lived presigned URL (15 minutes expiration)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    
    // Construct CDN URL (using production custom domain or configured public base)
    const baseUrl = (R2_PUBLIC_BASE_URL || R2_CUSTOM_CDN_DOMAIN).replace(/\/+$/, '');
    const publicUrl = `${baseUrl}/${key}`;

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl,
        mediaUrl: publicUrl,
        publicUrl,
        key,
        maxSizeBytes: constraint.maxSizeBytes
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
