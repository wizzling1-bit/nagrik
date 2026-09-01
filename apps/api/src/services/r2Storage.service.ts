import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, isR2Configured } from '../config/r2';
import { ENV } from '../config/env';
import crypto from 'crypto';

export interface PresignedUploadResponse {
  uploadUrl: string;
  mediaUrl: string;
  key: string;
}

export class R2StorageService {
  /**
   * Generate secure presigned upload URL for Cloudflare R2
   * DO NOT USE AWS S3. All media is strictly stored on Cloudflare R2.
   */
  static async getPresignedUploadUrl(
    folder: 'images' | 'videos' | 'thumbnails',
    mimeType: string,
    fileExtension: string
  ): Promise<PresignedUploadResponse> {
    const filename = `${crypto.randomBytes(16).toString('hex')}.${fileExtension.replace('.', '')}`;
    const key = `media/${folder}/${filename}`;

    if (!isR2Configured()) {
      // Local fallback url when Cloudflare R2 env vars are not set
      const mockUploadUrl = `http://localhost:${ENV.PORT}/api/v1/uploads/mock-r2-upload?key=${encodeURIComponent(key)}`;
      const mockMediaUrl = `http://localhost:${ENV.PORT}/uploads/${key}`;
      return {
        uploadUrl: mockUploadUrl,
        mediaUrl: mockMediaUrl,
        key
      };
    }

    const command = new PutObjectCommand({
      Bucket: ENV.R2_BUCKET_NAME,
      Key: key,
      ContentType: mimeType
    });

    // Generate presigned PUT URL valid for 15 minutes
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    const mediaUrl = `${ENV.R2_PUBLIC_BASE_URL}/${key}`;

    return {
      uploadUrl,
      mediaUrl,
      key
    };
  }
}
