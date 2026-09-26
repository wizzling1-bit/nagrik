-- ==========================================================
-- seed.sql
-- NAAGRIK PLATFORM - SEED DATA FOR CATEGORIES, SETTINGS & CMS
-- ==========================================================

-- 1. Default System Settings
INSERT INTO system_settings (key, min_payout_amount, earning_rate_per_1000_views, max_counted_views_per_video, ad_feed_frequency)
VALUES ('DEFAULT', 10.00, 1.0000, 3, 4)
ON CONFLICT (key) DO UPDATE
SET min_payout_amount = EXCLUDED.min_payout_amount,
    earning_rate_per_1000_views = EXCLUDED.earning_rate_per_1000_views,
    max_counted_views_per_video = EXCLUDED.max_counted_views_per_video,
    ad_feed_frequency = EXCLUDED.ad_feed_frequency;

-- 2. Core Journalism Categories
INSERT INTO categories (name, slug, display_order, status) VALUES
('Civic Issues', 'civic-issues', 1, 'ACTIVE'),
('Infrastructure & Roads', 'infrastructure', 2, 'ACTIVE'),
('Local Governance & Wards', 'local', 3, 'ACTIVE'),
('Crime & Safety', 'crime', 4, 'ACTIVE'),
('Environment & Health', 'environment', 5, 'ACTIVE'),
('Agriculture & Farming', 'agriculture', 6, 'ACTIVE'),
('Education & Jobs', 'education', 7, 'ACTIVE'),
('Culture & Heritage', 'culture', 8, 'ACTIVE')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    status = EXCLUDED.status;

-- 3. Core Hyperlocal Locations
INSERT INTO locations (country, state, city, area, coordinates) VALUES
('India', 'Bihar', 'Patna', 'Kankarbagh', '{"latitude": 25.5941, "longitude": 85.1376}'::jsonb),
('India', 'Bihar', 'Patna', 'Boring Road', '{"latitude": 25.6186, "longitude": 85.1189}'::jsonb),
('India', 'Bihar', 'Patna', 'Rajendra Nagar', '{"latitude": 25.6022, "longitude": 85.1612}'::jsonb),
('India', 'Bihar', 'Gaya', 'Civil Lines', '{"latitude": 24.7914, "longitude": 85.0002}'::jsonb),
('India', 'Delhi', 'New Delhi', 'Connaught Place', '{"latitude": 28.6315, "longitude": 77.2167}'::jsonb),
('India', 'Uttar Pradesh', 'Lucknow', 'Hazratganj', '{"latitude": 26.8467, "longitude": 80.9462}'::jsonb)
ON CONFLICT DO NOTHING;

-- 4. Default CMS Pages (Editorial Guidelines & Terms)
INSERT INTO cms_pages (slug, title, content, published) VALUES
('terms', 'Terms & Conditions', 'Welcome to Nagrik. By accessing or publishing content on our platform, you agree to abide by our ground journalism integrity principles, verified location standards, and non-defamatory community rules.', true),
('privacy', 'Privacy Policy', 'Nagrik is committed to protecting citizen privacy. Our consumer discovery app requires zero login credentials, authenticating your device via anonymous persistent UUIDs.', true),
('creator-agreement', 'Journalist Contributor Agreement', 'This Contributor Agreement defines the revenue sharing model ($1.00 per 1,000 verified views, subject to a 3-view monetization ceiling per consumer device) and zero-tolerance policy for fabricated reporting.', true)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    content = EXCLUDED.content,
    published = EXCLUDED.published;
