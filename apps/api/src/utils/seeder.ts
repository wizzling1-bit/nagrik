import bcrypt from 'bcryptjs';
import {
  CategoriesDb,
  LocationsDb,
  UsersDb,
  CreatorsDb,
  SystemSettingsDb,
  CmsDb
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

  // 5. Default CMS & Legal Documents
  try {
    const defaultCmsPages = [
      {
        slug: 'terms',
        title: 'Terms of Service & Civic Charter',
        version: '2.1',
        content: `### 1. Civic Integrity & Publisher Charter\nNagrik is dedicated to authentic, verified ground reporting. All contributors agree to publish factual, unbiased local investigations without inciting violence or defamatory falsehoods.\n\n### 2. Fair Revenue Disbursal\nPublishers are compensated based on counted verified video impressions under strict anti-bot fraud policies ($1.50 CPM base).\n\n### 3. Termination\nAccounts attempting automated replay attacks or view fraud are permanently suspended.`
      },
      {
        slug: 'privacy',
        title: 'Privacy Policy & Data Rights',
        version: '1.4',
        content: `### 1. Hyperlocal Geo-Coordinates\nWe use GPS and ward-level location tags solely to deliver relevant local news feeds. We never sell raw location coordinates to third parties.\n\n### 2. Creator Bank & UPI Details\nFinancial identifiers are encrypted and used solely for payout disbursals.`
      },
      {
        slug: 'creator',
        title: 'Citizen Reporter & Creator Partner Agreement',
        version: '2.0',
        content: `### 1. Independent Publisher Relationship\nPublishers act as independent citizen journalists and retain intellectual copyright of their original camera footage.\n\n### 2. Monetization Rules\nEarnings accrue per 1,000 valid views up to a daily ceiling per viewer device. Minimum withdrawal threshold is $10.00 USD.`
      },
      {
        slug: 'dmca',
        title: 'DMCA Copyright & Content Takedown Policy',
        version: '1.2',
        content: `### 1. Intellectual Property Protection\nNagrik complies with international DMCA copyright directives. If you believe your copyrighted video or audio has been used without authorization, submit a notice to legal@nagrik.news.\n\n### 2. Counter-Notices\nPublishers may file counter-notices within 14 business days.`
      }
    ];

    for (const page of defaultCmsPages) {
      await CmsDb.upsert(page);
    }
    console.log('[Seeder] Default Legal CMS Pages seeded.');
  } catch (err: any) {
    console.warn('[Seeder] CMS seeding error:', err.message);
  }
};
