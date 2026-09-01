import { Response } from 'express';
import { AuthRequest } from '../middlewares/rbac';
import { ViewTrackingService } from '../services/viewTracking.service';

export class ViewController {
  /**
   * Register video view with backend 3-view ceiling rule enforcement.
   * Works for authenticated users OR credential-free anonymous mobile devices via deviceId.
   */
  static async registerView(req: AuthRequest, res: Response) {
    try {
      const { videoId, deviceId } = req.body;
      if (!videoId) {
        return res.status(400).json({ success: false, error: 'videoId is required' });
      }

      // Determine viewer identifier: Authenticated user ID, or Device ID, or Header Device ID
      const viewerId = req.user?.id || deviceId || (req.headers['x-device-id'] as string) || req.deviceId;
      if (!viewerId) {
        return res.status(400).json({
          success: false,
          error: 'Viewer identification required. Provide Authorization Bearer token or deviceId in body/headers.'
        });
      }

      const result = await ViewTrackingService.registerVideoView(viewerId, videoId);
      return res.json({ success: true, ...result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
