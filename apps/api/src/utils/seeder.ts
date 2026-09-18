import bcrypt from 'bcryptjs';
import {
  CategoriesDb,
  LocationsDb,
  UsersDb,
  CreatorsDb,
  ContentsDb,
  SystemSettingsDb,
  CmsDb
} from '../db/supabaseClient';
import { UserRole, ModerationStatus, ContentType } from '@naagrik/shared-types';

export const seedDatabase = async () => {
  // 1. Categories
  try {
    const defaultCategories = [
      { name: 'नागरिक मुद्दा (Civic Issues)', slug: 'civic-issues', displayOrder: 1 },
      { name: 'अवसंरचना (Infrastructure)', slug: 'infrastructure', displayOrder: 2 },
      { name: 'स्थानीय शासन (Local Governance)', slug: 'local', displayOrder: 3 },
      { name: 'अपराध व सुरक्षा (Crime & Safety)', slug: 'crime', displayOrder: 4 },
      { name: 'पर्यावरण व स्वास्थ्य (Environment)', slug: 'environment', displayOrder: 5 }
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
      earningRatePer1000Views: 1.00,
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
    { country: 'India', state: 'Uttar Pradesh', city: 'Varanasi', area: 'Godowlia' },
    { country: 'India', state: 'Karnataka', city: 'Bengaluru', area: 'Indiranagar' }
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
    const adminEmails = ['admin@naagrik.news', 'admin@nagrik.news'];
    const passwordHash = await bcrypt.hash('AdminPass123!', 10);

    for (const email of adminEmails) {
      const existing = await UsersDb.findByEmail(email);
      if (!existing) {
        await UsersDb.create({
          name: 'Chief Editorial Admin',
          email,
          passwordHash,
          role: UserRole.ADMIN,
          location: defaultLocations[0]
        });
        console.log(`[Seeder] Default Admin seeded: ${email} / AdminPass123!`);
      }
    }
  } catch (err: any) {
    console.warn('[Seeder] Admin seeding error:', err.message);
  }

  // 5. Default Creator Account & Sample Content
  try {
    const creatorEmails = ['creator1@naagrik.news', 'creator1@nagrik.news'];
    const passwordHash = await bcrypt.hash('CreatorPass123!', 10);
    let primaryCreatorProfile: any = null;

    for (const email of creatorEmails) {
      let creatorUser = await UsersDb.findByEmail(email);
      if (!creatorUser) {
        creatorUser = await UsersDb.create({
          name: 'राहुल शर्मा (वरिष्ठ स्ट्रिंगर)',
          email,
          passwordHash,
          role: UserRole.CREATOR,
          location: defaultLocations[0]
        });
      }

      let creatorProfile = await CreatorsDb.findByUserId(creatorUser.id);
      if (!creatorProfile) {
        creatorProfile = await CreatorsDb.create({
          userId: creatorUser.id,
          bio: 'वार्ड 14 व कंकड़बाग क्षेत्र से लाइव नागरिक रिपोर्टिंग।',
          availableBalance: 42.50,
          lifetimeEarnings: 215.00,
          totalEligibleViews: 143000
        });
        console.log(`[Seeder] Default Creator seeded: ${email} / CreatorPass123!`);
      }

      if (!primaryCreatorProfile) {
        primaryCreatorProfile = creatorProfile;
      }
    }

    // Seed sample approved news if feed is empty
    const existingCount = await ContentsDb.count({ moderationStatus: ModerationStatus.APPROVED });
    if (existingCount === 0 && primaryCreatorProfile) {
      const civicCat = await CategoriesDb.findBySlug('civic-issues') || await CategoriesDb.findBySlug('local');
      const infraCat = await CategoriesDb.findBySlug('infrastructure') || civicCat;

      const sampleArticles = [
        {
          creatorId: primaryCreatorProfile.id,
          type: ContentType.ARTICLE,
          title: 'पटना कंकड़बाग में नए ड्रेनेज पंपिंग स्टेशन का सफल परीक्षण, 50,000 घरों को जलजमाव से मिलेगी राहत',
          description: 'कंकड़बाग वार्ड 14 में पिछले दो वर्षों से लंबित ड्रेनेज पम्पिंग स्टेशन का आज नगर निगम द्वारा सफल ट्रायल रन पूरा किया गया। बारिश के दिनों में जलजमाव की समस्या से जूझ रहे स्थानीय निवासियों ने राहत की सांस ली है। ग्राउंड स्ट्रिंगर राहुल शर्मा की लाइव रिपोर्ट।\n\nस्थानीय पार्षद और नगर आयुक्त ने मौके पर पहुंचकर 250 हॉर्सपावर के तीन सबमर्सिबल पंपों के फ्लो रेट का परीक्षण किया। निगम अधिकारियों ने दावा किया है कि इस वर्ष मानसून में मुख्य सड़कों पर 30 मिनट से अधिक पानी नहीं टिकेगा।',
          mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
          categoryId: civicCat ? civicCat.id : 'civic-issues',
          location: defaultLocations[0],
          moderationStatus: ModerationStatus.APPROVED,
          publicationStatus: 'PUBLISHED' as const
        },
        {
          creatorId: primaryCreatorProfile.id,
          type: ContentType.VIDEO,
          title: 'वाराणसी गोदौलिया चौराहे पर स्मार्ट ट्रैफिक सिग्नल और पैदल पथ का जीर्णोद्धार पूरा',
          description: 'वाराणसी के सबसे व्यस्त गोदौलिया-दशाश्वमेध मार्ग पर नए स्मार्ट ट्रैफिक सिस्टम और हेरिटेज वॉकवे का कार्य संपन्न हो गया है। ग्राउंड कैमरे से कैद की गई विशेष वीडियो बाइट में देखें कैसे अब पैदल यात्रियों को मिलेगी सुगम आवाजाही।\n\nपर्यटन और स्थानीय व्यापार को बढ़ावा देने के लिए चौराहे पर चौबीसों घंटे निगरानी वाले एआई कैमरे भी लगाए गए हैं।',
          mediaUrl: 'https://storage.nagrik.news/sample.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
          categoryId: infraCat ? infraCat.id : 'infrastructure',
          location: defaultLocations[2],
          moderationStatus: ModerationStatus.APPROVED,
          publicationStatus: 'PUBLISHED' as const
        },
        {
          creatorId: primaryCreatorProfile.id,
          type: ContentType.ARTICLE,
          title: 'बेंगलुरु इंदिरानगर में नागरिक समूह ने शुरू किया 5km साइकिल ट्रैक कॉरिडोर अभियान',
          description: 'स्थानीय निवासियों और स्कूल छात्रों ने सुरक्षित साइकिल चालन के लिए अलग लेन की मांग को लेकर शांतिपूर्ण जागरूकता मार्च निकाला। 1,200 से अधिक नागरिकों ने हस्ताक्षरित ज्ञापन बीबीएमपी आयुक्त को सौंपा।',
          mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
          categoryId: civicCat ? civicCat.id : 'civic-issues',
          location: defaultLocations[3],
          moderationStatus: ModerationStatus.APPROVED,
          publicationStatus: 'PUBLISHED' as const
        }
      ];

      for (const art of sampleArticles) {
        await ContentsDb.create(art);
      }
      console.log('[Seeder] 3 Sample Approved Ground Stories seeded.');
    }
  } catch (err: any) {
    console.warn('[Seeder] Creator/Content seeding error:', err.message);
  }

  // 6. Default CMS & Legal Documents
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
