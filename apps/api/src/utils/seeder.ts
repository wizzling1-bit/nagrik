import bcrypt from 'bcryptjs';
import {
  CategoriesDb,
  LocationsDb,
  UsersDb,
  SystemSettingsDb
} from '../db/supabaseClient';
import { UserRole } from '@naagrik/shared-types';

export const seedDatabase = async () => {
  try {
    // Categories
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

    // Default System Settings
    await SystemSettingsDb.upsert({
      minPayoutAmount: 10.00,
      earningRatePer1000Views: 1.50,
      maxCountedViewsPerVideo: 3,
      adFeedFrequency: 4
    });

    // Default Locations
    const defaultLocations = [
      { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      { country: 'India', state: 'Bihar', city: 'Patna', area: 'Boring Road' },
      { country: 'India', state: 'Bihar', city: 'Patna', area: 'Patna Sahib' },
      { country: 'India', state: 'Bihar', city: 'Gaya', area: 'Bodhgaya' }
    ];

    for (const loc of defaultLocations) {
      await LocationsDb.upsert(loc);
    }

    // Default Admin User
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
  } catch (err) {
    console.error('[Seeder] Error during initial seed:', err);
  }
};
