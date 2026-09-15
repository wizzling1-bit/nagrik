import { z } from 'zod';

// Roles & Enums
export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN'
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO'
}

export enum ModerationStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export enum PayoutMethodType {
  BANK = 'BANK',
  UPI = 'UPI'
}

export enum AdType {
  BANNER = 'BANNER',
  VIDEO = 'VIDEO',
  SPONSORED = 'SPONSORED'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Business Rules Constants
export const BUSINESS_RULES = {
  MAX_COUNTED_VIEWS_PER_VIDEO: 3,
  MIN_PAYOUT_AMOUNT: 10.00, // US$ 10.00
  DEFAULT_EARNING_RATE_PER_1000_VIEWS: 1.50, // $1.50 per 1000 eligible views
  DEFAULT_AD_FEED_FREQUENCY: 4 // insert ad every 4 content items
};

// Location Interface
export interface ILocationData {
  country: string;
  state: string;
  city: string;
  area: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// User Interfaces
export interface IUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  location?: ILocationData;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Creator Interface
export interface ICreator {
  id: string;
  userId: string;
  bio?: string;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  totalEligibleViews: number;
  availableBalance: number;
  lifetimeEarnings: number;
  totalPaid: number;
  user?: IUser;
  createdAt: string;
  updatedAt: string;
}

// Content Interface
export interface IContent {
  id: string;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  type: ContentType;
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  categoryName?: string;
  location: ILocationData;
  moderationStatus: ModerationStatus;
  rejectionReason?: string;
  publicationStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  eligibleViews: number;
  likes: number;
  shares: number;
  saves: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Video View Interface
export interface IVideoView {
  id: string;
  userId: string;
  videoId: string;
  countedViewCount: number;
  lastViewedAt: string;
}

// Advertisement Interface
export interface IAdvertisement {
  id: string;
  name: string;
  type: AdType;
  mediaUrl: string;
  targetLocation?: Partial<ILocationData>;
  targetCategory?: string;
  startDate: string;
  endDate: string;
  frequency: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  clicks: number;
  impressions: number;
  createdAt: string;
}

// Payout Method Interface
export interface IPayoutMethod {
  id: string;
  creatorId: string;
  type: PayoutMethodType;
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  upiId?: string;
  isDefault: boolean;
}

// Payout Request Interface
export interface IPayoutRequest {
  id: string;
  creatorId: string;
  creatorName?: string;
  creatorEmail?: string;
  amount: number;
  payoutMethod: IPayoutMethod;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  transactionReference?: string;
  adminNote?: string;
}

// System Settings
export interface ISystemSettings {
  minPayoutAmount: number;
  earningRatePer1000Views: number;
  maxCountedViewsPerVideo: number;
  adFeedFrequency: number;
  supportedCategories: string[];
}

// Audit Log Interface
export interface IAuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Zod Validation Schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  phone: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const ContentCreateSchema = z.object({
  type: z.nativeEnum(ContentType),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  mediaUrl: z.string().url('Valid media URL is required'),
  thumbnailUrl: z.string().url('Valid thumbnail URL is required'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z.object({
    country: z.string().default('India'),
    state: z.string(),
    city: z.string(),
    area: z.string(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }).optional()
  })
});

export const ModerationActionSchema = z.object({
  contentId: z.string(),
  status: z.enum([ModerationStatus.APPROVED, ModerationStatus.REJECTED, ModerationStatus.FLAGGED]),
  rejectionReason: z.string().optional()
});

export const PayoutRequestSchema = z.object({
  amount: z.number().min(BUSINESS_RULES.MIN_PAYOUT_AMOUNT, `Minimum payout is $${BUSINESS_RULES.MIN_PAYOUT_AMOUNT}`),
  payoutMethodId: z.string()
});

export const ProcessPayoutSchema = z.object({
  requestId: z.string(),
  status: z.enum([PayoutStatus.PAID, PayoutStatus.REJECTED, PayoutStatus.PROCESSING]),
  transactionReference: z.string().optional(),
  adminNote: z.string().optional()
});
