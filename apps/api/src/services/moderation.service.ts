import { ContentsDb, AuditLogsDb } from '../db/supabaseClient';
import { ModerationStatus, UserRole } from '@naagrik/shared-types';

const PROHIBITED_KEYWORDS = ['vulgar_word', 'hate_speech', 'explicit_content', 'abusive_term'];

export class ModerationService {
  /**
   * Automated moderation scanner on content submission
   */
  static autoScanContent(text: string): { isClean: boolean; flagReason?: string } {
    const lower = text.toLowerCase();
    for (const word of PROHIBITED_KEYWORDS) {
      if (lower.includes(word)) {
        return { isClean: false, flagReason: `Contains prohibited content identifier: '${word}'` };
      }
    }
    return { isClean: true };
  }

  /**
   * Admin manual moderation action
   */
  static async reviewContent(
    adminId: string,
    adminEmail: string,
    contentId: string,
    status: ModerationStatus,
    rejectionReason?: string
  ) {
    const content = await ContentsDb.findById(contentId);
    if (!content) {
      throw new Error('Content not found.');
    }

    if (status === ModerationStatus.REJECTED && !rejectionReason) {
      throw new Error('Rejection reason is required when rejecting content.');
    }

    const updated = await ContentsDb.update(contentId, {
      moderationStatus: status,
      moderation_status: status,
      rejectionReason: rejectionReason || null,
      rejection_reason: rejectionReason || null
    });

    // Record Audit Log
    await AuditLogsDb.create({
      actorId: adminId,
      actorEmail: adminEmail,
      actorRole: UserRole.ADMIN,
      action: `CONTENT_MODERATION_${status}`,
      entity: 'Content',
      entityId: contentId,
      metadata: { status, rejectionReason }
    });

    return updated;
  }
}
