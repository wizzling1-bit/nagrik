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
  totalViews?: number;
  totalEligibleViews?: number;
  ratePer1000Views?: number;
  verificationStatus?: string;
  totalStories?: number;
  pendingReviewCount?: number;
  approvedCount?: number;
}
