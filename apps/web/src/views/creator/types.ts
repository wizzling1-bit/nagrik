export type CreatorTab =
  | 'analytics'
  | 'upload'
  | 'files'
  | 'playlists'
  | 'branding'
  | 'billing'
  | 'agreement';

export interface CreatorStats {
  availableBalance?: number;
  lifetimeEarnings?: number;
  totalPaid?: number;
  totalViews?: number;
  totalEligibleViews?: number;
  ratePer1000Views?: number;
  verificationStatus?: string;
  totalStories?: number;
  totalContent?: number;
  publishedContent?: number;
  pendingContent?: number;
  rejectedContent?: number;
  pendingReviewCount?: number;
  approvedCount?: number;
  pendingPayoutAmount?: number;
}
