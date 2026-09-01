import { v4 as uuidv4 } from 'uuid';
import { supabase, isLiveSupabaseConfigured } from '../config/supabase';
import {
  UserRole,
  UserStatus,
  ModerationStatus,
  ContentType,
  PayoutStatus,
  PayoutMethodType,
  AdType,
  BUSINESS_RULES,
  ILocationData
} from '@naagrik/shared-types';

// Helper to normalize objects with _id <-> id compatibility
export const normalizeDoc = <T extends Record<string, any>>(doc: T | null | undefined): (T & { _id: string; id: string }) | null => {
  if (!doc) return null;
  const id = doc.id || doc._id || uuidv4();
  return {
    ...doc,
    id,
    _id: id
  };
};

export const normalizeDocs = <T extends Record<string, any>>(docs: T[]): (T & { _id: string; id: string })[] => {
  return docs.map(d => normalizeDoc(d)!);
};

// In-Memory fallback store for tests and offline local development
class MemoryDataStore {
  users: any[] = [];
  creators: any[] = [];
  categories: any[] = [];
  locations: any[] = [];
  contents: any[] = [];
  videoViews: any[] = [];
  advertisements: any[] = [];
  payoutMethods: any[] = [];
  payoutRequests: any[] = [];
  systemSettings: any[] = [];
  reports: any[] = [];
  auditLogs: any[] = [];
  notifications: any[] = [];

  clear() {
    this.users = [];
    this.creators = [];
    this.categories = [];
    this.locations = [];
    this.contents = [];
    this.videoViews = [];
    this.advertisements = [];
    this.payoutMethods = [];
    this.payoutRequests = [];
    this.systemSettings = [];
    this.reports = [];
    this.auditLogs = [];
    this.notifications = [];
  }
}

export const memoryStore = new MemoryDataStore();

// ==========================================================
// USERS REPOSITORY
// ==========================================================
export const UsersDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const found = memoryStore.users.find(u => u.id === id || u._id === id);
    return normalizeDoc(found);
  },

  async findByEmail(email: string) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const found = memoryStore.users.find(u => u.email?.toLowerCase() === cleanEmail);
    return normalizeDoc(found);
  },

  async create(user: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    phone?: string;
    location?: ILocationData;
    profileImage?: string;
    status?: UserStatus;
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      name: user.name.trim(),
      email: user.email.toLowerCase().trim(),
      password_hash: user.passwordHash,
      passwordHash: user.passwordHash,
      role: user.role || UserRole.USER,
      phone: user.phone?.trim() || null,
      location: user.location || { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      profile_image: user.profileImage || null,
      profileImage: user.profileImage || null,
      status: user.status || UserStatus.ACTIVE,
      saved_content_ids: [],
      savedContentIds: [],
      fcm_tokens: [],
      fcmTokens: [],
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').insert([{
        id: doc.id,
        name: doc.name,
        email: doc.email,
        password_hash: doc.password_hash,
        role: doc.role,
        phone: doc.phone,
        location: doc.location,
        status: doc.status
      }]).select().single();
      if (error) throw error;
      return normalizeDoc({ ...doc, ...data });
    }

    memoryStore.users.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('users').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const idx = memoryStore.users.findIndex(u => u.id === id || u._id === id);
    if (idx >= 0) {
      memoryStore.users[idx] = {
        ...memoryStore.users[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return normalizeDoc(memoryStore.users[idx]);
    }
    return null;
  },

  async count(role?: UserRole) {
    if (isLiveSupabaseConfigured()) {
      let query = supabase.from('users').select('*', { count: 'exact', head: true });
      if (role) query = query.eq('role', role);
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    }
    if (role) {
      return memoryStore.users.filter(u => u.role === role).length;
    }
    return memoryStore.users.length;
  }
};

// ==========================================================
// CREATORS REPOSITORY
// ==========================================================
export const CreatorsDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('creators').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const found = memoryStore.creators.find(c => c.id === id || c._id === id);
    return normalizeDoc(found);
  },

  async findByUserId(userId: string) {
    if (!userId) return null;
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('creators').select('*').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const found = memoryStore.creators.find(c => c.userId === userId || c.user_id === userId);
    return normalizeDoc(found);
  },

  async create(creator: {
    userId: string;
    bio?: string;
    verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
    availableBalance?: number;
    lifetimeEarnings?: number;
    totalEligibleViews?: number;
    totalPaid?: number;
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      userId: creator.userId,
      user_id: creator.userId,
      bio: creator.bio || '',
      verificationStatus: creator.verificationStatus || 'UNVERIFIED',
      verification_status: creator.verificationStatus || 'UNVERIFIED',
      totalEligibleViews: creator.totalEligibleViews || 0,
      total_eligible_views: creator.totalEligibleViews || 0,
      availableBalance: creator.availableBalance || 0,
      available_balance: creator.availableBalance || 0,
      lifetimeEarnings: creator.lifetimeEarnings || 0,
      lifetime_earnings: creator.lifetimeEarnings || 0,
      totalPaid: creator.totalPaid || 0,
      total_paid: creator.totalPaid || 0,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('creators').insert([{
        id: doc.id,
        user_id: doc.user_id,
        bio: doc.bio,
        verification_status: doc.verification_status,
        available_balance: doc.available_balance,
        lifetime_earnings: doc.lifetime_earnings,
        total_eligible_views: doc.total_eligible_views,
        total_paid: doc.total_paid
      }]).select().single();
      if (error) throw error;
      return normalizeDoc({ ...doc, ...data });
    }

    memoryStore.creators.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('creators').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const idx = memoryStore.creators.findIndex(c => c.id === id || c._id === id);
    if (idx >= 0) {
      memoryStore.creators[idx] = {
        ...memoryStore.creators[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return normalizeDoc(memoryStore.creators[idx]);
    }
    return null;
  },

  async count() {
    if (isLiveSupabaseConfigured()) {
      const { count, error } = await supabase.from('creators').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
    return memoryStore.creators.length;
  }
};

// ==========================================================
// CATEGORIES REPOSITORY
// ==========================================================
export const CategoriesDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    return normalizeDoc(memoryStore.categories.find(c => c.id === id || c._id === id));
  },

  async findBySlug(slug: string) {
    if (!slug) return null;
    const clean = slug.toLowerCase().trim();
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', clean).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    return normalizeDoc(memoryStore.categories.find(c => c.slug?.toLowerCase() === clean));
  },

  async findByName(name: string) {
    if (!name) return null;
    const clean = name.toLowerCase().trim();
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').select('*').ilike('name', clean).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    return normalizeDoc(memoryStore.categories.find(c => c.name?.toLowerCase() === clean));
  },

  async create(cat: { name: string; slug?: string; displayOrder?: number; status?: 'ACTIVE' | 'INACTIVE' }) {
    const id = uuidv4();
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    const doc = {
      id,
      _id: id,
      name: cat.name.trim(),
      slug,
      displayOrder: cat.displayOrder || 0,
      display_order: cat.displayOrder || 0,
      status: cat.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').insert([{
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        display_order: doc.display_order,
        status: doc.status
      }]).select().single();
      if (error) throw error;
      return normalizeDoc({ ...doc, ...data });
    }

    memoryStore.categories.push(doc);
    return normalizeDoc(doc);
  },

  async upsert(cat: { name: string; slug: string; displayOrder?: number }) {
    const existing = await this.findBySlug(cat.slug);
    if (existing) {
      if (isLiveSupabaseConfigured()) {
        const { data, error } = await supabase.from('categories').update({
          name: cat.name,
          display_order: cat.displayOrder || 0,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id).select().single();
        if (error) throw error;
        return normalizeDoc(data);
      }
      existing.name = cat.name;
      existing.displayOrder = cat.displayOrder || 0;
      existing.display_order = cat.displayOrder || 0;
      return existing;
    }
    return this.create(cat);
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return normalizeDocs(data || []);
    }
    const list = [...memoryStore.categories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return normalizeDocs(list);
  }
};

// ==========================================================
// LOCATIONS REPOSITORY
// ==========================================================
export const LocationsDb = {
  async upsert(loc: { country?: string; state: string; city: string; area: string; coordinates?: any }) {
    const country = loc.country || 'India';
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      country,
      state: loc.state,
      city: loc.city,
      area: loc.area,
      coordinates: loc.coordinates || null,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      const { data: existing } = await supabase.from('locations').select('*').eq('city', doc.city).eq('area', doc.area).maybeSingle();
      if (existing) {
        return normalizeDoc(existing);
      }
      const { data, error } = await supabase.from('locations').insert([{
        country: doc.country,
        state: doc.state,
        city: doc.city,
        area: doc.area,
        coordinates: doc.coordinates
      }]).select().maybeSingle();
      if (error && error.code !== '23505') throw error;
      return normalizeDoc(data || doc);
    }

    const existingIdx = memoryStore.locations.findIndex(l => l.city === loc.city && l.area === loc.area);
    if (existingIdx >= 0) {
      memoryStore.locations[existingIdx] = { ...memoryStore.locations[existingIdx], ...loc };
      return normalizeDoc(memoryStore.locations[existingIdx]);
    }
    memoryStore.locations.push(doc);
    return normalizeDoc(doc);
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) throw error;
      return normalizeDocs(data || []);
    }
    return normalizeDocs(memoryStore.locations);
  }
};

// ==========================================================
// CONTENTS REPOSITORY
// ==========================================================
export const ContentsDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('contents').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return normalizeDoc(data);
    }
    return normalizeDoc(memoryStore.contents.find(c => c.id === id || c._id === id));
  },

  async create(content: {
    creatorId: string;
    type: ContentType;
    title: string;
    description: string;
    mediaUrl: string;
    thumbnailUrl: string;
    categoryId: string;
    location: ILocationData;
    moderationStatus?: ModerationStatus;
    rejectionReason?: string;
    publicationStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      creatorId: content.creatorId,
      creator_id: content.creatorId,
      type: content.type,
      title: content.title.trim(),
      description: content.description,
      mediaUrl: content.mediaUrl,
      media_url: content.mediaUrl,
      thumbnailUrl: content.thumbnailUrl,
      thumbnail_url: content.thumbnailUrl,
      categoryId: content.categoryId,
      category_id: content.categoryId,
      location: content.location,
      moderationStatus: content.moderationStatus || ModerationStatus.PENDING_REVIEW,
      moderation_status: content.moderationStatus || ModerationStatus.PENDING_REVIEW,
      rejectionReason: content.rejectionReason || null,
      rejection_reason: content.rejectionReason || null,
      publicationStatus: content.publicationStatus || 'PUBLISHED',
      publication_status: content.publicationStatus || 'PUBLISHED',
      views: 0,
      eligibleViews: 0,
      eligible_views: 0,
      likes: 0,
      shares: 0,
      saves: 0,
      publishedAt: new Date().toISOString(),
      published_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('contents').insert([{
        id: doc.id,
        creator_id: doc.creator_id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        media_url: doc.media_url,
        thumbnail_url: doc.thumbnail_url,
        category_id: doc.category_id,
        location: doc.location,
        moderation_status: doc.moderation_status,
        rejection_reason: doc.rejection_reason,
        publication_status: doc.publication_status,
        views: 0,
        eligible_views: 0
      }]).select().single();
      if (error) throw error;
      return normalizeDoc({ ...doc, ...data });
    }

    memoryStore.contents.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('contents').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();
      if (error) throw error;
      return normalizeDoc(data);
    }
    const idx = memoryStore.contents.findIndex(c => c.id === id || c._id === id);
    if (idx >= 0) {
      memoryStore.contents[idx] = {
        ...memoryStore.contents[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return normalizeDoc(memoryStore.contents[idx]);
    }
    return null;
  },

  async find(filter: {
    creatorId?: string;
    moderationStatus?: ModerationStatus | string;
    publicationStatus?: string;
    type?: ContentType;
    categoryId?: string;
    city?: string;
    area?: string;
    searchQuery?: string;
    limit?: number;
    skip?: number;
  }) {
    let list = [...memoryStore.contents];

    if (filter.creatorId) {
      list = list.filter(c => c.creatorId === filter.creatorId || c.creator_id === filter.creatorId);
    }
    if (filter.moderationStatus) {
      list = list.filter(c => c.moderationStatus === filter.moderationStatus || c.moderation_status === filter.moderationStatus);
    }
    if (filter.publicationStatus) {
      list = list.filter(c => c.publicationStatus === filter.publicationStatus || c.publication_status === filter.publicationStatus);
    }
    if (filter.type) {
      list = list.filter(c => c.type === filter.type);
    }
    if (filter.categoryId) {
      list = list.filter(c => c.categoryId === filter.categoryId || c.category_id === filter.categoryId);
    }
    if (filter.city) {
      list = list.filter(c => c.location?.city?.toLowerCase() === filter.city?.toLowerCase());
    }
    if (filter.area) {
      list = list.filter(c => c.location?.area?.toLowerCase() === filter.area?.toLowerCase());
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      list = list.filter(c => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }

    list.sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

    const total = list.length;
    if (filter.skip !== undefined && filter.limit !== undefined) {
      list = list.slice(filter.skip, filter.skip + filter.limit);
    } else if (filter.limit !== undefined) {
      list = list.slice(0, filter.limit);
    }

    // Populate category and creator
    const populated = list.map(item => {
      const cat = memoryStore.categories.find(c => c.id === item.categoryId || c.id === item.category_id || c._id === item.categoryId);
      const creator = memoryStore.creators.find(cr => cr.id === item.creatorId || cr.id === item.creator_id || cr._id === item.creatorId);
      return {
        ...item,
        categoryId: cat ? normalizeDoc(cat) : item.categoryId,
        creatorId: creator ? normalizeDoc(creator) : item.creatorId
      };
    });

    return {
      contents: normalizeDocs(populated),
      total
    };
  },

  async count(filter?: { moderationStatus?: ModerationStatus | string; creatorId?: string }) {
    let list = memoryStore.contents;
    if (filter?.moderationStatus) {
      list = list.filter(c => c.moderationStatus === filter.moderationStatus || c.moderation_status === filter.moderationStatus);
    }
    if (filter?.creatorId) {
      list = list.filter(c => c.creatorId === filter.creatorId || c.creator_id === filter.creatorId);
    }
    return list.length;
  }
};

// ==========================================================
// VIDEO VIEWS REPOSITORY (3-View Ceiling Rule)
// ==========================================================
export const VideoViewsDb = {
  async findOne(userId: string, videoId: string) {
    const found = memoryStore.videoViews.find(
      v => (v.userId === userId || v.user_id === userId) && (v.videoId === videoId || v.video_id === videoId)
    );
    return normalizeDoc(found);
  },

  async create(view: { userId: string; videoId: string; countedViewCount?: number }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      userId: view.userId,
      user_id: view.userId,
      videoId: view.videoId,
      video_id: view.videoId,
      countedViewCount: view.countedViewCount || 0,
      counted_view_count: view.countedViewCount || 0,
      lastViewedAt: new Date().toISOString(),
      last_viewed_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.videoViews.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    const idx = memoryStore.videoViews.findIndex(v => v.id === id || v._id === id);
    if (idx >= 0) {
      memoryStore.videoViews[idx] = {
        ...memoryStore.videoViews[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return normalizeDoc(memoryStore.videoViews[idx]);
    }
    return null;
  }
};

// ==========================================================
// ADVERTISEMENTS REPOSITORY
// ==========================================================
export const AdvertisementsDb = {
  async create(ad: {
    name: string;
    type: AdType;
    mediaUrl: string;
    targetLocation?: Partial<ILocationData>;
    targetCategory?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    frequency?: number;
    status?: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      name: ad.name,
      type: ad.type,
      mediaUrl: ad.mediaUrl,
      media_url: ad.mediaUrl,
      targetLocation: ad.targetLocation || null,
      target_location: ad.targetLocation || null,
      targetCategory: ad.targetCategory || null,
      target_category: ad.targetCategory || null,
      startDate: new Date(ad.startDate || Date.now()).toISOString(),
      start_date: new Date(ad.startDate || Date.now()).toISOString(),
      endDate: new Date(ad.endDate || Date.now() + 30 * 86400000).toISOString(),
      end_date: new Date(ad.endDate || Date.now() + 30 * 86400000).toISOString(),
      frequency: ad.frequency || 4,
      status: ad.status || 'ACTIVE',
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.advertisements.push(doc);
    return normalizeDoc(doc);
  },

  async findActive() {
    const now = new Date().getTime();
    const active = memoryStore.advertisements.filter(a => {
      const start = new Date(a.startDate || a.start_date).getTime();
      const end = new Date(a.endDate || a.end_date).getTime();
      return a.status === 'ACTIVE' && start <= now && end >= now;
    });
    return normalizeDocs(active);
  },

  async list() {
    return normalizeDocs([...memoryStore.advertisements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async count(status = 'ACTIVE') {
    return memoryStore.advertisements.filter(a => a.status === status).length;
  }
};

// ==========================================================
// PAYOUT METHODS REPOSITORY
// ==========================================================
export const PayoutMethodsDb = {
  async findById(id: string) {
    if (!id) return null;
    return normalizeDoc(memoryStore.payoutMethods.find(m => m.id === id || m._id === id));
  },

  async findByCreatorId(creatorId: string) {
    const list = memoryStore.payoutMethods.filter(m => m.creatorId === creatorId || m.creator_id === creatorId);
    return normalizeDocs(list);
  },

  async create(method: {
    creatorId: string;
    type: PayoutMethodType;
    bankDetails?: any;
    upiId?: string;
    isDefault?: boolean;
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      creatorId: method.creatorId,
      creator_id: method.creatorId,
      type: method.type,
      bankDetails: method.bankDetails || null,
      bank_details: method.bankDetails || null,
      upiId: method.upiId || null,
      upi_id: method.upiId || null,
      isDefault: method.isDefault !== undefined ? method.isDefault : true,
      is_default: method.isDefault !== undefined ? method.isDefault : true,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.payoutMethods.push(doc);
    return normalizeDoc(doc);
  },

  async updateMany(creatorId: string, updates: Partial<any>) {
    memoryStore.payoutMethods.forEach(m => {
      if (m.creatorId === creatorId || m.creator_id === creatorId) {
        Object.assign(m, updates);
      }
    });
  }
};

// ==========================================================
// PAYOUT REQUESTS REPOSITORY ($10.00 Minimum Threshold)
// ==========================================================
export const PayoutRequestsDb = {
  async findById(id: string) {
    if (!id) return null;
    const req = memoryStore.payoutRequests.find(r => r.id === id || r._id === id);
    if (!req) return null;
    const method = memoryStore.payoutMethods.find(m => m.id === req.payoutMethodId || m.id === req.payout_method_id);
    const creator = memoryStore.creators.find(c => c.id === req.creatorId || c.id === req.creator_id);
    const user = creator ? memoryStore.users.find(u => u.id === creator.userId || u.id === creator.user_id) : null;
    return normalizeDoc({
      ...req,
      payoutMethodId: method ? normalizeDoc(method) : req.payoutMethodId,
      creatorId: creator ? { ...normalizeDoc(creator), userId: user ? normalizeDoc(user) : creator.userId } : req.creatorId
    });
  },

  async create(payout: {
    creatorId: string;
    amount: number;
    payoutMethodId: string;
    status?: PayoutStatus;
    requestedAt?: Date | string;
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      creatorId: payout.creatorId,
      creator_id: payout.creatorId,
      amount: Number(payout.amount),
      payoutMethodId: payout.payoutMethodId,
      payout_method_id: payout.payoutMethodId,
      status: payout.status || PayoutStatus.PENDING,
      requestedAt: new Date(payout.requestedAt || Date.now()).toISOString(),
      requested_at: new Date(payout.requestedAt || Date.now()).toISOString(),
      processedAt: null,
      processed_at: null,
      transactionReference: null,
      transaction_reference: null,
      adminNote: null,
      admin_note: null,
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.payoutRequests.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    const idx = memoryStore.payoutRequests.findIndex(r => r.id === id || r._id === id);
    if (idx >= 0) {
      memoryStore.payoutRequests[idx] = {
        ...memoryStore.payoutRequests[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return normalizeDoc(memoryStore.payoutRequests[idx]);
    }
    return null;
  },

  async find(filter?: { creatorId?: string; status?: PayoutStatus | string }) {
    let list = [...memoryStore.payoutRequests];
    if (filter?.creatorId) {
      list = list.filter(r => r.creatorId === filter.creatorId || r.creator_id === filter.creatorId);
    }
    if (filter?.status) {
      list = list.filter(r => r.status === filter.status);
    }
    list.sort((a, b) => new Date(b.requestedAt || b.requested_at).getTime() - new Date(a.requestedAt || a.requested_at).getTime());

    const populated = list.map(req => {
      const method = memoryStore.payoutMethods.find(m => m.id === req.payoutMethodId || m.id === req.payout_method_id);
      const creator = memoryStore.creators.find(c => c.id === req.creatorId || c.id === req.creator_id);
      const user = creator ? memoryStore.users.find(u => u.id === creator.userId || u.id === creator.user_id) : null;
      return {
        ...req,
        payoutMethodId: method ? normalizeDoc(method) : req.payoutMethodId,
        creatorId: creator ? { ...normalizeDoc(creator), userId: user ? normalizeDoc(user) : creator.userId } : req.creatorId
      };
    });

    return normalizeDocs(populated);
  },

  async count(status = PayoutStatus.PENDING) {
    return memoryStore.payoutRequests.filter(r => r.status === status).length;
  }
};

// ==========================================================
// SYSTEM SETTINGS REPOSITORY
// ==========================================================
export const SystemSettingsDb = {
  async get() {
    let setting = memoryStore.systemSettings.find(s => s.key === 'DEFAULT');
    if (!setting) {
      setting = await this.upsert({
        key: 'DEFAULT',
        minPayoutAmount: BUSINESS_RULES.MIN_PAYOUT_AMOUNT,
        earningRatePer1000Views: BUSINESS_RULES.DEFAULT_EARNING_RATE_PER_1000_VIEWS,
        maxCountedViewsPerVideo: BUSINESS_RULES.MAX_COUNTED_VIEWS_PER_VIDEO,
        adFeedFrequency: BUSINESS_RULES.DEFAULT_AD_FEED_FREQUENCY
      });
    }
    return normalizeDoc(setting);
  },

  async upsert(updates: Partial<any>) {
    let idx = memoryStore.systemSettings.findIndex(s => s.key === 'DEFAULT');
    const doc = {
      id: idx >= 0 ? memoryStore.systemSettings[idx].id : uuidv4(),
      key: 'DEFAULT',
      minPayoutAmount: updates.minPayoutAmount !== undefined ? updates.minPayoutAmount : BUSINESS_RULES.MIN_PAYOUT_AMOUNT,
      min_payout_amount: updates.minPayoutAmount !== undefined ? updates.minPayoutAmount : BUSINESS_RULES.MIN_PAYOUT_AMOUNT,
      earningRatePer1000Views: updates.earningRatePer1000Views !== undefined ? updates.earningRatePer1000Views : BUSINESS_RULES.DEFAULT_EARNING_RATE_PER_1000_VIEWS,
      earning_rate_per_1000_views: updates.earningRatePer1000Views !== undefined ? updates.earningRatePer1000Views : BUSINESS_RULES.DEFAULT_EARNING_RATE_PER_1000_VIEWS,
      maxCountedViewsPerVideo: updates.maxCountedViewsPerVideo !== undefined ? updates.maxCountedViewsPerVideo : BUSINESS_RULES.MAX_COUNTED_VIEWS_PER_VIDEO,
      max_counted_views_per_video: updates.maxCountedViewsPerVideo !== undefined ? updates.maxCountedViewsPerVideo : BUSINESS_RULES.MAX_COUNTED_VIEWS_PER_VIDEO,
      adFeedFrequency: updates.adFeedFrequency !== undefined ? updates.adFeedFrequency : BUSINESS_RULES.DEFAULT_AD_FEED_FREQUENCY,
      ad_feed_frequency: updates.adFeedFrequency !== undefined ? updates.adFeedFrequency : BUSINESS_RULES.DEFAULT_AD_FEED_FREQUENCY,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (idx >= 0) {
      memoryStore.systemSettings[idx] = { ...memoryStore.systemSettings[idx], ...doc };
      return normalizeDoc(memoryStore.systemSettings[idx]);
    }
    memoryStore.systemSettings.push(doc);
    return normalizeDoc(doc);
  }
};

// ==========================================================
// REPORTS & AUDIT LOGS REPOSITORIES
// ==========================================================
export const ReportsDb = {
  async create(report: { reporterId: string; contentId: string; reason: string; status?: string }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      reporterId: report.reporterId,
      reporter_id: report.reporterId,
      contentId: report.contentId,
      content_id: report.contentId,
      reason: report.reason,
      status: report.status || 'PENDING',
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    memoryStore.reports.push(doc);
    return normalizeDoc(doc);
  },

  async list() {
    return normalizeDocs([...memoryStore.reports].reverse());
  }
};

export const AuditLogsDb = {
  async create(log: {
    actorId: string;
    actorEmail: string;
    actorRole: UserRole;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: any;
  }) {
    const id = uuidv4();
    const doc = {
      id,
      _id: id,
      actorId: log.actorId,
      actor_id: log.actorId,
      actorEmail: log.actorEmail,
      actor_email: log.actorEmail,
      actorRole: log.actorRole,
      actor_role: log.actorRole,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId || null,
      entity_id: log.entityId || null,
      metadata: log.metadata || null,
      timestamp: new Date().toISOString()
    };
    memoryStore.auditLogs.push(doc);
    return normalizeDoc(doc);
  },

  async listRecent(limit = 100) {
    const sorted = [...memoryStore.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return normalizeDocs(sorted.slice(0, limit));
  }
};
