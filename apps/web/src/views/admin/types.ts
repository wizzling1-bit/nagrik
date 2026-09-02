export type AdminTab =
  | 'dashboard'
  | 'moderation'
  | 'creators'
  | 'payouts'
  | 'ads'
  | 'settings'
  | 'categories'
  | 'cms'
  | 'audit';

export interface AdminMetrics {
  totalUsers?: number;
  activeCreators?: number;
  totalCreators?: number;
  publishedContent?: number;
  pendingModeration?: number;
  flaggedModeration?: number;
  pendingPayoutsCount?: number;
  pendingPayouts?: number;
  activeAds?: number;
  totalPaidOut?: number;
  totalViews?: number;
  totalEligibleViews?: number;
  systemSetting?: any;
}

export interface AdminContextType {
  token: string | null;
  metrics: AdminMetrics | null;
  loading: boolean;
  searchFilter: string;
  setSearchFilter: (v: string) => void;
  fetchAllData: () => void;
  fetchDashboard: () => Promise<void>;
  fetchModerationQueue: () => Promise<void>;
  fetchPayouts: () => Promise<void>;
  fetchAds: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchCreators: () => Promise<void>;
  fetchCmsPages: () => Promise<void>;
  cmsPages: any[];
  modStatusFilter: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED';
  setModStatusFilter: (st: 'PENDING_REVIEW' | 'FLAGGED' | 'REJECTED' | 'APPROVED') => void;
  modItems: any[];
  creatorsList: any[];
  payouts: any[];
  ads: any[];
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  auditLogs: any[];
  handleModerate: (contentId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => Promise<void>;
  handleProcessPayout: (requestId: string, status: 'PAID' | 'REJECTED', txRef?: string) => Promise<void>;
  timeframe: '24h' | '7d' | '30d' | 'all';
  setTimeframe: (tf: '24h' | '7d' | '30d' | 'all') => void;
  API_BASE: string;
}
