import bcrypt from 'bcryptjs';
import {
  CategoriesDb,
  LocationsDb,
  UsersDb,
  CreatorsDb,
  SystemSettingsDb
} from '../db/supabaseClient';
import { UserRole } from '@naagrik/shared-types';

export const seedDatabase = async () => {
  // 1. Categories
  try {
    const defaultCategories = [
      { name: 'Local', slug: 'local', displayOrder: 1 },
      { name: 'Politics', slug: 'politics', displayOrder: 2 },
      { name: 'Crime', slug: 'crime', displayOrder: 3 },
      { name: 'Sports', slug: 'sports', displayOrder: 4 },
      { name: 'Business', slug: 'business', displayOrder: 5 },
      { name: 'Entertainment', slug: 'entertainment', displayOrder: 6 }
    ];

    for (const cat of defaultCategories) {
      await CategoriesDb.upsert(cat);
    }
  } catch (err: any) {
    console.warn('[Seeder] Categories seeding note:', err.message);
  }

  // 2. Default System Settings
  try {
    await SystemSettingsDb.upsert({
      minPayoutAmount: 10.00,
      earningRatePer1000Views: 1.50,
      maxCountedViewsPerVideo: 3,
      adFeedFrequency: 4
    });
  } catch (err: any) {
    console.warn('[Seeder] Settings seeding note:', err.message);
  }

  // 3. Default Locations
  const defaultLocations = [
    { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
    { country: 'India', state: 'Bihar', city: 'Patna', area: 'Boring Road' },
    { country: 'India', state: 'Bihar', city: 'Patna', area: 'Patna Sahib' },
    { country: 'India', state: 'Bihar', city: 'Gaya', area: 'Bodhgaya' }
  ];

  try {
    for (const loc of defaultLocations) {
      await LocationsDb.upsert(loc);
    }
  } catch (err: any) {
    console.warn('[Seeder] Locations seeding note:', err.message);
  }

  // 4. Default Admin User
  try {
    const adminEmail = 'admin@naagrik.news';
    const existingAdmin = await UsersDb.findByEmail(adminEmail);
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('AdminPass123!', 10);
      await UsersDb.create({
        name: 'Chief Editorial Admin',
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        location: defaultLocations[0]
      });
      console.log('[Seeder] Default Admin seeded: admin@naagrik.news / AdminPass123!');
    }
  } catch (err: any) {
    console.warn('[Seeder] Admin seeding error:', err.message);
  }

  // 5. Default Creator User
  try {
    const creatorEmail = 'creator1@naagrik.news';
    const existingCreator = await UsersDb.findByEmail(creatorEmail);
    if (!existingCreator) {
      const passwordHash = await bcrypt.hash('CreatorPass123!', 10);
      const newCreatorUser = await UsersDb.create({
        name: 'Rahul Kumar (Reporter)',
        email: creatorEmail,
        passwordHash,
        role: UserRole.CREATOR,
        location: defaultLocations[0]
      });
      await CreatorsDb.create({
        userId: newCreatorUser.id,
        bio: 'Senior Hyperlocal Citizen Reporter for Patna & Bihar.',
        verificationStatus: 'VERIFIED',
        availableBalance: 24.50,
        lifetimeEarnings: 58.00,
        totalEligibleViews: 38666,
        totalPaid: 33.50
      });
      console.log('[Seeder] Default Creator seeded: creator1@naagrik.news / CreatorPass123!');
    }
  } catch (err: any) {
    console.warn('[Seeder] Creator seeding error:', err.message);
  }
};
