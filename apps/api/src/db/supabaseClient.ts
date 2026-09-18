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

// Helper to validate UUID format
export const isUuid = (str: string | null | undefined): boolean => {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

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
  cmsPages: any[] = [];

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
    this.cmsPages = [];
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
      if (!isUuid(id)) return null;
      const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
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
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.location !== undefined) dbUpdates.location = updates.location;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.profileImage !== undefined || updates.profile_image !== undefined) {
          dbUpdates.profile_image = updates.profileImage ?? updates.profile_image;
        }
        if (updates.savedContentIds !== undefined || updates.saved_content_ids !== undefined) {
          dbUpdates.saved_content_ids = updates.savedContentIds ?? updates.saved_content_ids;
        }
        if (updates.fcmTokens !== undefined || updates.fcm_tokens !== undefined) {
          dbUpdates.fcm_tokens = updates.fcmTokens ?? updates.fcm_tokens;
        }

        const { data, error } = await supabase.from('users').update(dbUpdates).eq('id', id).select().single();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[UsersDb] update live error:', err.message);
      }
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
      if (!isUuid(id)) return null;
      const { data, error } = await supabase.from('creators').select('*').eq('id', id).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
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
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.verificationStatus !== undefined || updates.verification_status !== undefined) {
          dbUpdates.verification_status = updates.verificationStatus ?? updates.verification_status;
        }
        if (updates.totalEligibleViews !== undefined || updates.total_eligible_views !== undefined) {
          dbUpdates.total_eligible_views = updates.totalEligibleViews ?? updates.total_eligible_views;
        }
        if (updates.availableBalance !== undefined || updates.available_balance !== undefined) {
          dbUpdates.available_balance = updates.availableBalance ?? updates.available_balance;
        }
        if (updates.lifetimeEarnings !== undefined || updates.lifetime_earnings !== undefined) {
          dbUpdates.lifetime_earnings = updates.lifetimeEarnings ?? updates.lifetime_earnings;
        }
        if (updates.totalPaid !== undefined || updates.total_paid !== undefined) {
          dbUpdates.total_paid = updates.totalPaid ?? updates.total_paid;
        }

        const { data, error } = await supabase.from('creators').update(dbUpdates).eq('id', id).select().single();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[CreatorsDb] update live error:', err.message);
      }
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
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('creators').select('*, users(*)');
      if (error) throw error;
      return (data || []).map(normalizeDoc);
    }
    return memoryStore.creators.map(c => {
      const u = memoryStore.users.find(usr => usr.id === c.userId || usr._id === c.userId || usr.id === c.user_id || usr._id === c.user_id);
      return normalizeDoc({ ...c, user: u ? normalizeDoc(u) : null });
    });
  }
};

// ==========================================================
// CATEGORIES REPOSITORY
// ==========================================================
export const CategoriesDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      if (!isUuid(id)) {
        return this.findBySlug(id);
      }
      try {
        const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[CategoriesDb] findById live error:', err.message);
      }
      return this.findBySlug(id);
    }
    const found = memoryStore.categories.find(c => c.id === id || c._id === id || c.slug?.toLowerCase() === id.toLowerCase());
    return normalizeDoc(found);
  },

  async findBySlug(slug: string) {
    if (!slug) return null;
    const clean = slug.toLowerCase().trim().replace(/^cat_/, '');
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('categories').select('*').eq('slug', clean).maybeSingle();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[CategoriesDb] findBySlug live error:', err.message);
      }
    }
    return normalizeDoc(memoryStore.categories.find(c => c.slug?.toLowerCase() === clean || c.id === clean || c._id === clean));
  },

  async findByName(name: string) {
    if (!name) return null;
    const clean = name.toLowerCase().trim();
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('categories').select('*').ilike('name', `%${clean}%`).maybeSingle();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[CategoriesDb] findByName live error:', err.message);
      }
    }
    return normalizeDoc(memoryStore.categories.find(c => c.name?.toLowerCase().includes(clean)));
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
      try {
        const { data, error } = await supabase.from('categories').insert([{
          id: doc.id,
          name: doc.name,
          slug: doc.slug,
          display_order: doc.display_order,
          status: doc.status
        }]).select().single();
        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[CategoriesDb] create live error:', err.message);
      }
    }

    memoryStore.categories.push(doc);
    return normalizeDoc(doc);
  },

  async upsert(cat: { name: string; slug: string; displayOrder?: number }) {
    const existing = await this.findBySlug(cat.slug);
    if (existing) {
      if (isLiveSupabaseConfigured() && isUuid(existing.id)) {
        try {
          const { data, error } = await supabase.from('categories').update({
            name: cat.name,
            display_order: cat.displayOrder || 0,
            updated_at: new Date().toISOString()
          }).eq('id', existing.id).select().single();
          if (!error && data) return normalizeDoc(data);
        } catch (err: any) {
          console.warn('[CategoriesDb] upsert live error:', err.message);
        }
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
      try {
        const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[CategoriesDb] list live error:', err.message);
      }
    }
    const list = [...memoryStore.categories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return normalizeDocs(list);
  },

  async update(id: string, updates: { name?: string; slug?: string; displayOrder?: number; status?: 'ACTIVE' | 'INACTIVE' }) {
    let targetId = id;
    if (!isUuid(targetId)) {
      const cat = await this.findBySlug(id);
      if (cat) targetId = cat.id;
    }

    if (isLiveSupabaseConfigured() && isUuid(targetId)) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
        if (updates.displayOrder !== undefined) dbUpdates.display_order = updates.displayOrder;
        if (updates.status !== undefined) dbUpdates.status = updates.status;

        const { data, error } = await supabase.from('categories').update(dbUpdates).eq('id', targetId).select().single();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[CategoriesDb] update live error:', err.message);
      }
    }
    const cat = memoryStore.categories.find(c => c.id === id || c._id === id || c.id === targetId || c._id === targetId);
    if (cat) {
      if (updates.name !== undefined) cat.name = updates.name;
      if (updates.slug !== undefined) cat.slug = updates.slug;
      if (updates.displayOrder !== undefined) {
        cat.displayOrder = updates.displayOrder;
        cat.display_order = updates.displayOrder;
      }
      if (updates.status !== undefined) cat.status = updates.status;
      cat.updatedAt = new Date().toISOString();
      cat.updated_at = new Date().toISOString();
      return normalizeDoc(cat);
    }
    return null;
  },

  async delete(id: string) {
    let targetId = id;
    if (!isUuid(targetId)) {
      const cat = await this.findBySlug(id);
      if (cat) targetId = cat.id;
    }

    if (isLiveSupabaseConfigured() && isUuid(targetId)) {
      try {
        await supabase.from('categories').delete().eq('id', targetId);
      } catch (err: any) {
        console.warn('[CategoriesDb] delete live error:', err.message);
      }
    }
    const idx = memoryStore.categories.findIndex(c => c.id === id || c._id === id || c.id === targetId || c._id === targetId);
    if (idx !== -1) {
      memoryStore.categories.splice(idx, 1);
    }
    return true;
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
      if (!isUuid(id)) return null;
      try {
        const { data, error } = await supabase.from('contents').select('*, categories(*), creators(*, users(*))').eq('id', id).maybeSingle();
        if (!error && data) {
          return normalizeDoc({
            ...data,
            creatorId: data.creators ? {
              ...normalizeDoc(data.creators),
              userId: data.creators.users ? normalizeDoc(data.creators.users) : data.creators.user_id
            } : data.creator_id,
            creator_id: data.creator_id,
            categoryId: data.categories ? normalizeDoc(data.categories) : data.category_id,
            category_id: data.category_id,
            mediaUrl: data.media_url,
            thumbnailUrl: data.thumbnail_url,
            moderationStatus: data.moderation_status,
            rejectionReason: data.rejection_reason,
            publicationStatus: data.publication_status,
            eligibleViews: data.eligible_views,
            publishedAt: data.published_at,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          });
        }
      } catch (err: any) {
        console.warn('[ContentsDb] findById live error:', err.message);
      }
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
    let resolvedCategoryId = content.categoryId;
    if (resolvedCategoryId && !isUuid(resolvedCategoryId)) {
      const cat = await CategoriesDb.findBySlug(resolvedCategoryId);
      if (cat) resolvedCategoryId = cat.id;
    }

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
      categoryId: resolvedCategoryId,
      category_id: resolvedCategoryId,
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
      updatedAt_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('contents').insert([{
          id: doc.id,
          creator_id: doc.creator_id,
          type: doc.type,
          title: doc.title,
          description: doc.description,
          media_url: doc.media_url,
          thumbnail_url: doc.thumbnail_url,
          category_id: isUuid(doc.category_id) ? doc.category_id : null,
          location: doc.location,
          moderation_status: doc.moderation_status,
          rejection_reason: doc.rejection_reason,
          publication_status: doc.publication_status,
          views: 0,
          eligible_views: 0
        }]).select().single();
        if (!error && data) {
          return normalizeDoc({ ...doc, ...data });
        }
      } catch (err: any) {
        // Fallback to local memoryStore if live table schema differs
      }
    }

    memoryStore.contents.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.views !== undefined) dbUpdates.views = updates.views;
        if (updates.eligibleViews !== undefined || updates.eligible_views !== undefined) {
          dbUpdates.eligible_views = updates.eligibleViews ?? updates.eligible_views;
        }
        if (updates.likes !== undefined) dbUpdates.likes = updates.likes;
        if (updates.shares !== undefined) dbUpdates.shares = updates.shares;
        if (updates.saves !== undefined) dbUpdates.saves = updates.saves;
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.mediaUrl !== undefined || updates.media_url !== undefined) {
          dbUpdates.media_url = updates.mediaUrl ?? updates.media_url;
        }
        if (updates.thumbnailUrl !== undefined || updates.thumbnail_url !== undefined) {
          dbUpdates.thumbnail_url = updates.thumbnailUrl ?? updates.thumbnail_url;
        }
        if (updates.categoryId !== undefined || updates.category_id !== undefined) {
          let catId = updates.categoryId ?? updates.category_id;
          if (catId && !isUuid(catId)) {
            const cat = await CategoriesDb.findBySlug(catId);
            if (cat) catId = cat.id;
          }
          if (isUuid(catId)) {
            dbUpdates.category_id = catId;
          }
        }
        if (updates.moderationStatus !== undefined || updates.moderation_status !== undefined) {
          dbUpdates.moderation_status = updates.moderationStatus ?? updates.moderation_status;
        }
        if (updates.rejectionReason !== undefined || updates.rejection_reason !== undefined) {
          dbUpdates.rejection_reason = updates.rejectionReason ?? updates.rejection_reason;
        }
        if (updates.publicationStatus !== undefined || updates.publication_status !== undefined) {
          dbUpdates.publication_status = updates.publicationStatus ?? updates.publication_status;
        }
        if (updates.publishedAt !== undefined || updates.published_at !== undefined) {
          dbUpdates.published_at = updates.publishedAt ?? updates.published_at;
        }

        if (isUuid(id)) {
          const { data, error } = await supabase.from('contents').update(dbUpdates).eq('id', id).select().single();
          if (!error && data) return normalizeDoc(data);
        }
      } catch (err: any) {
        console.warn('[ContentsDb] update live error:', err.message);
      }
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
    if (isLiveSupabaseConfigured()) {
      try {
        let query = supabase.from('contents').select('*, categories(*), creators(*, users(*))', { count: 'exact' });

        if (filter.creatorId && isUuid(filter.creatorId)) query = query.eq('creator_id', filter.creatorId);
        if (filter.moderationStatus) query = query.eq('moderation_status', filter.moderationStatus);
        if (filter.publicationStatus) query = query.eq('publication_status', filter.publicationStatus);
        if (filter.type) query = query.eq('type', filter.type);
        if (filter.categoryId) {
          let catId = filter.categoryId;
          if (!isUuid(catId)) {
            const cat = await CategoriesDb.findBySlug(catId);
            if (cat) catId = cat.id;
          }
          if (isUuid(catId)) {
            query = query.eq('category_id', catId);
          }
        }
        if (filter.city) query = query.filter('location->>city', 'ilike', `%${filter.city}%`);
        if (filter.area) query = query.filter('location->>area', 'ilike', `%${filter.area}%`);
        if (filter.searchQuery) {
          query = query.or(`title.ilike.%${filter.searchQuery}%,description.ilike.%${filter.searchQuery}%`);
        }

        query = query.order('created_at', { ascending: false });

        if (filter.skip !== undefined && filter.limit !== undefined) {
          query = query.range(filter.skip, filter.skip + filter.limit - 1);
        } else if (filter.limit !== undefined) {
          query = query.limit(filter.limit);
        }

        const { data, count, error } = await query;
        if (!error && data) {
          const formatted = data.map(item => ({
            ...item,
            creatorId: item.creators ? {
              ...normalizeDoc(item.creators),
              userId: item.creators.users ? normalizeDoc(item.creators.users) : item.creators.user_id
            } : item.creator_id,
            creator_id: item.creator_id,
            categoryId: item.categories ? normalizeDoc(item.categories) : item.category_id,
            category_id: item.category_id,
            mediaUrl: item.media_url,
            thumbnailUrl: item.thumbnail_url,
            moderationStatus: item.moderation_status,
            rejectionReason: item.rejection_reason,
            publicationStatus: item.publication_status,
            eligibleViews: item.eligible_views,
            publishedAt: item.published_at,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
          return {
            contents: normalizeDocs(formatted),
            total: count !== null ? count : formatted.length
          };
        }
      } catch (err: any) {
        console.warn('[ContentsDb] find live error, falling back to memory store:', err.message);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        let query = supabase.from('contents').select('*', { count: 'exact', head: true });
        if (filter?.moderationStatus) query = query.eq('moderation_status', filter.moderationStatus);
        if (filter?.creatorId) query = query.eq('creator_id', filter.creatorId);
        const { count, error } = await query;
        if (!error && count !== null) return count;
      } catch (err: any) {
        console.warn('[ContentsDb] count live error:', err.message);
      }
    }

    let list = memoryStore.contents;
    if (filter?.moderationStatus) {
      list = list.filter(c => c.moderationStatus === filter.moderationStatus || c.moderation_status === filter.moderationStatus);
    }
    if (filter?.creatorId) {
      list = list.filter(c => c.creatorId === filter.creatorId || c.creator_id === filter.creatorId);
    }
    return list.length;
  },

  async delete(id: string) {
    if (!id) return false;
    if (isLiveSupabaseConfigured() && isUuid(id)) {
      try {
        await supabase.from('contents').delete().eq('id', id);
      } catch (err: any) {
        console.warn('[ContentsDb] delete live error:', err.message);
      }
    }
    const idx = memoryStore.contents.findIndex(c => c.id === id || c._id === id);
    if (idx >= 0) {
      memoryStore.contents.splice(idx, 1);
      return true;
    }
    return true;
  }
};

// ==========================================================
// VIDEO VIEWS REPOSITORY (3-View Ceiling Rule: User & Device)
// ==========================================================
export const VideoViewsDb = {
  async findOne(viewerId: string, videoId: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        if (isUuid(viewerId)) {
          const { data: userView } = await supabase
            .from('video_views')
            .select('*')
            .eq('user_id', viewerId)
            .eq('video_id', videoId)
            .maybeSingle();
          if (userView) return normalizeDoc(userView);
        }

        const { data: deviceView } = await supabase
          .from('video_views')
          .select('*')
          .eq('device_id', viewerId)
          .eq('video_id', videoId)
          .maybeSingle();
        if (deviceView) return normalizeDoc(deviceView);

        return null;
      } catch (err: any) {
        console.warn('[VideoViewsDb] findOne error, falling back to memory store:', err.message);
      }
    }

    const found = memoryStore.videoViews.find(
      v => (v.userId === viewerId || v.user_id === viewerId || v.deviceId === viewerId || v.device_id === viewerId) &&
           (v.videoId === videoId || v.video_id === videoId)
    );
    return normalizeDoc(found);
  },

  async create(view: { userId: string; videoId: string; countedViewCount?: number }) {
    const id = uuidv4();
    const viewerId = view.userId;
    const countedViews = view.countedViewCount || 0;

    if (isLiveSupabaseConfigured()) {
      try {
        // Check if viewerId is a registered user
        const user = isUuid(viewerId) ? await UsersDb.findById(viewerId) : null;
        const insertPayload: any = {
          id,
          video_id: view.videoId,
          counted_view_count: countedViews,
          last_viewed_at: new Date().toISOString()
        };
        if (user) {
          insertPayload.user_id = viewerId;
        } else {
          insertPayload.device_id = viewerId;
        }

        const { data, error } = await supabase
          .from('video_views')
          .insert([insertPayload])
          .select()
          .single();

        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[VideoViewsDb] create error, falling back to memory store:', err.message);
      }
    }

    const doc = {
      id,
      _id: id,
      userId: viewerId,
      user_id: viewerId,
      deviceId: viewerId,
      device_id: viewerId,
      videoId: view.videoId,
      video_id: view.videoId,
      countedViewCount: countedViews,
      counted_view_count: countedViews,
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
    if (isLiveSupabaseConfigured()) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.countedViewCount !== undefined) dbUpdates.counted_view_count = updates.countedViewCount;
        if (updates.counted_view_count !== undefined) dbUpdates.counted_view_count = updates.counted_view_count;
        if (updates.lastViewedAt !== undefined) dbUpdates.last_viewed_at = updates.lastViewedAt;
        if (updates.last_viewed_at !== undefined) dbUpdates.last_viewed_at = updates.last_viewed_at;

        const { data, error } = await supabase
          .from('video_views')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[VideoViewsDb] update error, falling back to memory store:', err.message);
      }
    }

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

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('advertisements').insert([{
          id: doc.id,
          name: doc.name,
          type: doc.type,
          media_url: doc.media_url,
          target_location: doc.target_location,
          target_category: doc.target_category,
          start_date: doc.start_date,
          end_date: doc.end_date,
          frequency: doc.frequency,
          status: doc.status,
          clicks: 0,
          impressions: 0
        }]).select().single();

        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[AdvertisementsDb] create error, falling back to memory store:', err.message);
      }
    }

    memoryStore.advertisements.push(doc);
    return normalizeDoc(doc);
  },

  async findActive() {
    if (isLiveSupabaseConfigured()) {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('status', 'ACTIVE')
          .lte('start_date', now)
          .gte('end_date', now);

        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[AdvertisementsDb] findActive error, falling back to memory store:', err.message);
      }
    }

    const nowTime = new Date().getTime();
    const active = memoryStore.advertisements.filter(a => {
      const start = new Date(a.startDate || a.start_date).getTime();
      const end = new Date(a.endDate || a.end_date).getTime();
      return a.status === 'ACTIVE' && start <= nowTime && end >= nowTime;
    });
    return normalizeDocs(active);
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[AdvertisementsDb] list error, falling back to memory store:', err.message);
      }
    }

    return normalizeDocs([...memoryStore.advertisements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  async count(status = 'ACTIVE') {
    if (isLiveSupabaseConfigured()) {
      try {
        const { count, error } = await supabase
          .from('advertisements')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);

        if (!error && count !== null) return count;
      } catch (err: any) {
        console.warn('[AdvertisementsDb] count error:', err.message);
      }
    }

    return memoryStore.advertisements.filter(a => a.status === status).length;
  }
};

// ==========================================================
// PAYOUT METHODS REPOSITORY
// ==========================================================
export const PayoutMethodsDb = {
  async findById(id: string) {
    if (!id) return null;
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('payout_methods').select('*').eq('id', id).maybeSingle();
        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[PayoutMethodsDb] findById error:', err.message);
      }
    }
    return normalizeDoc(memoryStore.payoutMethods.find(m => m.id === id || m._id === id));
  },

  async findByCreatorId(creatorId: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('payout_methods').select('*').eq('creator_id', creatorId);
        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[PayoutMethodsDb] findByCreatorId error:', err.message);
      }
    }
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

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('payout_methods').insert([{
          id: doc.id,
          creator_id: doc.creator_id,
          type: doc.type,
          bank_details: doc.bank_details,
          upi_id: doc.upi_id,
          is_default: doc.is_default
        }]).select().single();

        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[PayoutMethodsDb] create error, falling back to memory store:', err.message);
      }
    }

    memoryStore.payoutMethods.push(doc);
    return normalizeDoc(doc);
  },

  async updateMany(creatorId: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault;
        if (updates.is_default !== undefined) dbUpdates.is_default = updates.is_default;
        await supabase.from('payout_methods').update(dbUpdates).eq('creator_id', creatorId);
      } catch (err: any) {
        console.warn('[PayoutMethodsDb] updateMany error:', err.message);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('payout_requests').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          const method = await PayoutMethodsDb.findById(data.payout_method_id);
          const creator = await CreatorsDb.findById(data.creator_id);
          const user = creator ? await UsersDb.findById(creator.userId || creator.user_id) : null;
          return normalizeDoc({
            ...data,
            payoutMethodId: method ? normalizeDoc(method) : data.payout_method_id,
            creatorId: creator ? { ...normalizeDoc(creator), userId: user ? normalizeDoc(user) : creator.userId } : data.creator_id
          });
        }
      } catch (err: any) {
        console.warn('[PayoutRequestsDb] findById error:', err.message);
      }
    }

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

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('payout_requests').insert([{
          id: doc.id,
          creator_id: doc.creator_id,
          amount: doc.amount,
          payout_method_id: doc.payout_method_id,
          status: doc.status,
          requested_at: doc.requested_at
        }]).select().single();

        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[PayoutRequestsDb] create error, falling back to memory store:', err.message);
      }
    }

    memoryStore.payoutRequests.push(doc);
    return normalizeDoc(doc);
  },

  async update(id: string, updates: Partial<any>) {
    if (isLiveSupabaseConfigured()) {
      try {
        const dbUpdates: any = { updated_at: new Date().toISOString() };
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.transactionReference !== undefined) dbUpdates.transaction_reference = updates.transactionReference;
        if (updates.transaction_reference !== undefined) dbUpdates.transaction_reference = updates.transaction_reference;
        if (updates.processedAt !== undefined) dbUpdates.processed_at = updates.processedAt;
        if (updates.processed_at !== undefined) dbUpdates.processed_at = updates.processed_at;
        if (updates.adminNote !== undefined) dbUpdates.admin_note = updates.adminNote;
        if (updates.admin_note !== undefined) dbUpdates.admin_note = updates.admin_note;

        const { data, error } = await supabase
          .from('payout_requests')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return normalizeDoc(data);
      } catch (err: any) {
        console.warn('[PayoutRequestsDb] update error, falling back to memory store:', err.message);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        let query = supabase.from('payout_requests').select('*');
        if (filter?.creatorId) query = query.eq('creator_id', filter.creatorId);
        if (filter?.status) query = query.eq('status', filter.status);
        query = query.order('requested_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data) {
          const populated = await Promise.all(
            data.map(async req => {
              const method = await PayoutMethodsDb.findById(req.payout_method_id);
              const creator = await CreatorsDb.findById(req.creator_id);
              const user = creator ? await UsersDb.findById(creator.userId || creator.user_id) : null;
              return {
                ...req,
                payoutMethodId: method ? normalizeDoc(method) : req.payout_method_id,
                creatorId: creator ? { ...normalizeDoc(creator), userId: user ? normalizeDoc(user) : creator.userId } : req.creator_id
              };
            })
          );
          return normalizeDocs(populated);
        }
      } catch (err: any) {
        console.warn('[PayoutRequestsDb] find error, falling back to memory store:', err.message);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const { count, error } = await supabase
          .from('payout_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);

        if (!error && count !== null) return count;
      } catch (err: any) {
        console.warn('[PayoutRequestsDb] count error:', err.message);
      }
    }

    return memoryStore.payoutRequests.filter(r => r.status === status).length;
  }
};

// ==========================================================
// SYSTEM SETTINGS REPOSITORY
// ==========================================================
export const SystemSettingsDb = {
  async get() {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('system_settings').select('*').eq('key', 'DEFAULT').maybeSingle();
        if (!error && data) {
          return normalizeDoc({
            ...data,
            minPayoutAmount: Number(data.min_payout_amount),
            earningRatePer1000Views: Number(data.earning_rate_per_1000_views),
            maxCountedViewsPerVideo: Number(data.max_counted_views_per_video),
            adFeedFrequency: Number(data.ad_feed_frequency)
          });
        }
      } catch (err: any) {
        console.warn('[SystemSettingsDb] get error, falling back to memory store:', err.message);
      }
    }

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
    const minPayout = updates.minPayoutAmount !== undefined ? updates.minPayoutAmount : (updates.min_payout_amount !== undefined ? updates.min_payout_amount : BUSINESS_RULES.MIN_PAYOUT_AMOUNT);
    const earningRate = updates.earningRatePer1000Views !== undefined ? updates.earningRatePer1000Views : (updates.earning_rate_per_1000_views !== undefined ? updates.earning_rate_per_1000_views : BUSINESS_RULES.DEFAULT_EARNING_RATE_PER_1000_VIEWS);
    const maxCounted = updates.maxCountedViewsPerVideo !== undefined ? updates.maxCountedViewsPerVideo : (updates.max_counted_views_per_video !== undefined ? updates.max_counted_views_per_video : BUSINESS_RULES.MAX_COUNTED_VIEWS_PER_VIDEO);
    const adFreq = updates.adFeedFrequency !== undefined ? updates.adFeedFrequency : (updates.ad_feed_frequency !== undefined ? updates.ad_feed_frequency : BUSINESS_RULES.DEFAULT_AD_FEED_FREQUENCY);

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('system_settings').upsert([{
          key: 'DEFAULT',
          min_payout_amount: minPayout,
          earning_rate_per_1000_views: earningRate,
          max_counted_views_per_video: maxCounted,
          ad_feed_frequency: adFreq,
          updated_at: new Date().toISOString()
        }], { onConflict: 'key' }).select().single();

        if (!error && data) {
          return normalizeDoc({
            ...data,
            minPayoutAmount: Number(data.min_payout_amount),
            earningRatePer1000Views: Number(data.earning_rate_per_1000_views),
            maxCountedViewsPerVideo: Number(data.max_counted_views_per_video),
            adFeedFrequency: Number(data.ad_feed_frequency)
          });
        }
      } catch (err: any) {
        console.warn('[SystemSettingsDb] upsert error, falling back to memory store:', err.message);
      }
    }

    let idx = memoryStore.systemSettings.findIndex(s => s.key === 'DEFAULT');
    const doc = {
      id: idx >= 0 ? memoryStore.systemSettings[idx].id : uuidv4(),
      key: 'DEFAULT',
      minPayoutAmount: minPayout,
      min_payout_amount: minPayout,
      earningRatePer1000Views: earningRate,
      earning_rate_per_1000_views: earningRate,
      maxCountedViewsPerVideo: maxCounted,
      max_counted_views_per_video: maxCounted,
      adFeedFrequency: adFreq,
      ad_feed_frequency: adFreq,
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

    if (isLiveSupabaseConfigured()) {
      try {
        const isRegisteredUser = isUuid(report.reporterId) ? await UsersDb.findById(report.reporterId) : null;
        const insertPayload: any = {
          id,
          content_id: report.contentId,
          reason: report.reason,
          status: report.status || 'PENDING'
        };
        if (isRegisteredUser) {
          insertPayload.reporter_id = report.reporterId;
        } else {
          insertPayload.reporter_device_id = report.reporterId;
        }

        const { data, error } = await supabase
          .from('reports')
          .insert([insertPayload])
          .select()
          .single();

        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[ReportsDb] create error, falling back to memory store:', err.message);
      }
    }

    memoryStore.reports.push(doc);
    return normalizeDoc(doc);
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*, contents(*)')
          .order('created_at', { ascending: false });

        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[ReportsDb] list error, falling back to memory store:', err.message);
      }
    }

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

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('audit_logs').insert([{
          id: doc.id,
          actor_id: doc.actor_id,
          actor_email: doc.actor_email,
          actor_role: doc.actor_role,
          action: doc.action,
          entity: doc.entity,
          entity_id: doc.entity_id,
          metadata: doc.metadata,
          timestamp: doc.timestamp
        }]).select().single();

        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        console.warn('[AuditLogsDb] create error, falling back to memory store:', err.message);
      }
    }

    memoryStore.auditLogs.push(doc);
    return normalizeDoc(doc);
  },

  async listRecent(limit = 100) {
    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (!error && data) return normalizeDocs(data);
      } catch (err: any) {
        console.warn('[AuditLogsDb] listRecent error, falling back to memory store:', err.message);
      }
    }

    const sorted = [...memoryStore.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return normalizeDocs(sorted.slice(0, limit));
  }
};

// ==========================================================
// CMS & LEGAL PAGES REPOSITORY
// ==========================================================
export const CmsDb = {
  async findBySlug(slug: string) {
    const clean = slug.toLowerCase().trim();
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('cms_pages').select('*').eq('slug', clean).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) return normalizeDoc(data);
    }
    const found = memoryStore.cmsPages.find(p => p.slug === clean);
    return normalizeDoc(found);
  },

  async list() {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.from('cms_pages').select('*').order('updated_at', { ascending: false });
      if (error && error.code !== 'PGRST116') throw error;
      if (data && data.length > 0) return normalizeDocs(data);
    }
    return normalizeDocs([...memoryStore.cmsPages]);
  },

  async upsert(page: { slug: string; title: string; content: string; version?: string; isPublished?: boolean }) {
    const cleanSlug = page.slug.toLowerCase().trim();
    const existing = await this.findBySlug(cleanSlug);
    const id = existing?.id || uuidv4();
    const doc = {
      id,
      _id: id,
      slug: cleanSlug,
      title: page.title,
      content: page.content,
      version: page.version || '1.0',
      isPublished: page.isPublished !== undefined ? page.isPublished : true,
      is_published: page.isPublished !== undefined ? page.isPublished : true,
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      created_at: existing?.created_at || new Date().toISOString()
    };

    if (isLiveSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('cms_pages').upsert([{
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          content: doc.content,
          version: doc.version,
          is_published: doc.is_published,
          updated_at: doc.updated_at
        }]).select().single();
        if (!error && data) return normalizeDoc({ ...doc, ...data });
      } catch (err: any) {
        // Fallback to local memoryStore if live cms_pages table is not created
      }
    }

    const idx = memoryStore.cmsPages.findIndex(p => p.slug === cleanSlug || p.id === id);
    if (idx !== -1) {
      memoryStore.cmsPages[idx] = doc;
    } else {
      memoryStore.cmsPages.push(doc);
    }
    return normalizeDoc(doc);
  },

  async delete(id: string) {
    if (isLiveSupabaseConfigured()) {
      const { error } = await supabase.from('cms_pages').delete().eq('id', id);
      if (error && error.code !== 'PGRST116') throw error;
    }
    const idx = memoryStore.cmsPages.findIndex(p => p.id === id || p._id === id || p.slug === id);
    if (idx !== -1) {
      memoryStore.cmsPages.splice(idx, 1);
    }
    return true;
  }
};
