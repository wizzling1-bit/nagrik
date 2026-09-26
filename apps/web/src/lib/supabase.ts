import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sbcvvcqsmgihhzuifafq.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiY3Z2Y3FzbWdpaGh6dWlmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjgyMzksImV4cCI6MjEwNTEwNDIzOX0.0GFOvJmjhel0gpkOSypdwN1rs1o2sPo4LgtpyWhc63I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

/**
 * Cloudflare R2 Upload Helper
 * Invokes the Supabase Edge Function 'get-upload-url' with fallback to the Express backend API
 */
export async function getR2UploadUrl(
  folder: 'images' | 'videos' | 'thumbnails' | 'profiles',
  mimeType: string,
  fileExtension: string
) {
  try {
    // 1. Primary: Direct Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('get-upload-url', {
      body: { folder, mimeType, fileExtension }
    });

    if (!error && data?.uploadUrl) {
      return data;
    }
  } catch (edgeErr) {
    console.warn('Edge Function get-upload-url warning, checking Next.js upload-url endpoint:', edgeErr);
  }

  // 2. Secondary: Next.js internal App Router API endpoint
  const token = typeof window !== 'undefined' ? (localStorage.getItem('creator_token') || localStorage.getItem('auth_token')) : '';
  try {
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ folder, mimeType, fileExtension })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.uploadUrl) {
        return data;
      }
    }
  } catch (_) {}

  // 3. Fallback: Deterministic Cloudflare R2 / Custom CDN Public URL
  const r2PublicBase = process.env.NEXT_PUBLIC_CDN_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || 'https://media.nagrik.news';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const key = `${folder}/${timestamp}-${randomSuffix}.${fileExtension}`;
  const publicUrl = `${r2PublicBase}/${key}`;

  return {
    success: true,
    uploadUrl: publicUrl,
    mediaUrl: publicUrl,
    publicUrl,
    key
  };
}

/**
 * Direct File Uploader to CDN Media Storage via Presigned PUT with /api/upload-direct fallback
 */
export async function uploadFileToR2(
  file: File | Blob,
  folder: 'images' | 'videos' | 'thumbnails' | 'profiles' = 'videos',
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<{ mediaUrl: string; publicUrl: string; key: string }> {
  if (signal?.aborted) {
    const abortErr = new Error('Upload cancelled');
    abortErr.name = 'AbortError';
    throw abortErr;
  }

  const extension = file instanceof File ? (file.name.split('.').pop() || 'bin') : 'bin';
  const mimeType = file.type || 'application/octet-stream';

  // Strategy 1: Attempt Presigned PUT directly from browser
  try {
    const presignData = await getR2UploadUrl(folder as any, mimeType, extension);
    if (presignData?.uploadUrl && presignData.uploadUrl !== presignData.publicUrl) {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignData.uploadUrl, true);
        xhr.setRequestHeader('Content-Type', mimeType);

        if (signal) {
          if (signal.aborted) {
            xhr.abort();
            const abortErr = new Error('Upload cancelled');
            abortErr.name = 'AbortError';
            return reject(abortErr);
          }
          signal.addEventListener('abort', () => {
            xhr.abort();
          });
        }

        xhr.onabort = () => {
          const abortErr = new Error('Upload cancelled');
          abortErr.name = 'AbortError';
          reject(abortErr);
        };

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent);
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (onProgress) onProgress(100);
            resolve();
          } else {
            reject(new Error(`Direct media upload failed with HTTP status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during media upload'));
        xhr.send(file);
      });

      return {
        mediaUrl: presignData.mediaUrl || presignData.publicUrl,
        publicUrl: presignData.publicUrl,
        key: presignData.key
      };
    }
  } catch (putErr: any) {
    if (putErr?.name === 'AbortError' || signal?.aborted) {
      throw putErr;
    }
    console.warn('Direct presigned streaming notice, falling back to server ingestion pipeline:', putErr);
  }

  if (signal?.aborted) {
    const abortErr = new Error('Upload cancelled');
    abortErr.name = 'AbortError';
    throw abortErr;
  }

  // Strategy 2: Direct Server Upload via /api/upload-direct (with full progress & cancellation support)
  return new Promise<{ mediaUrl: string; publicUrl: string; key: string }>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload-direct', true);

    const token = typeof window !== 'undefined' ? (localStorage.getItem('creator_token') || localStorage.getItem('auth_token')) : '';
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        const abortErr = new Error('Upload cancelled');
        abortErr.name = 'AbortError';
        return reject(abortErr);
      }
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    xhr.onabort = () => {
      const abortErr = new Error('Upload cancelled');
      abortErr.name = 'AbortError';
      reject(abortErr);
    };

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (onProgress) onProgress(100);
          resolve({
            mediaUrl: data.publicUrl,
            publicUrl: data.publicUrl,
            key: data.key
          });
        } catch (e) {
          reject(new Error('Invalid response from media server'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during media upload'));
    xhr.send(formData);
  });
}

/**
 * Stored Procedure Helpers (RPC)
 */
export async function trackVideoView(videoId: string, userId?: string, deviceId?: string) {
  const { data, error } = await supabase.rpc('track_video_view', {
    p_video_id: videoId,
    p_user_id: userId || null,
    p_device_id: deviceId || (typeof window !== 'undefined' ? (localStorage.getItem('device_id') || 'browser_' + Math.random().toString(36).slice(2)) : 'unknown_device')
  });
  if (error) {
    console.error('track_video_view RPC error:', error);
    throw error;
  }
  return data;
}

export async function requestPayout(creatorId: string, amount: number, payoutMethodId: string) {
  const { data, error } = await supabase.rpc('request_payout', {
    p_creator_id: creatorId,
    p_amount: amount,
    p_payout_method_id: payoutMethodId
  });
  if (error) {
    console.error('request_payout RPC error:', error);
    throw error;
  }
  return data;
}

export async function adminModerateContent(
  contentId: string,
  moderationStatus: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW',
  rejectionReason?: string,
  adminId?: string
) {
  const { data, error } = await supabase.rpc('admin_moderate_content', {
    p_content_id: contentId,
    p_moderation_status: moderationStatus,
    p_rejection_reason: rejectionReason || null,
    p_admin_id: adminId || null
  });
  if (error) {
    console.error('admin_moderate_content RPC error:', error);
    throw error;
  }
  return data;
}

export async function adminProcessPayout(
  payoutId: string,
  status: 'PAID' | 'REJECTED' | 'PENDING',
  transactionReference?: string,
  adminNote?: string,
  adminId?: string
) {
  const { data, error } = await supabase.rpc('admin_process_payout', {
    p_payout_id: payoutId,
    p_status: status,
    p_transaction_reference: transactionReference || null,
    p_admin_note: adminNote || null,
    p_admin_id: adminId || null
  });
  if (error) {
    console.error('admin_process_payout RPC error:', error);
    throw error;
  }
  return data;
}

export async function getCreatorDashboardStats(creatorId: string) {
  const { data, error } = await supabase.rpc('get_creator_dashboard_stats', {
    p_creator_id: creatorId
  });
  if (error) {
    console.error('get_creator_dashboard_stats RPC error:', error);
    throw error;
  }
  return data;
}

export async function getAdminDashboardStats() {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
  if (error) {
    console.error('get_admin_dashboard_stats RPC error:', error);
    throw error;
  }
  return data;
}

