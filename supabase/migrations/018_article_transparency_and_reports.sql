-- ==========================================================
-- 018: ARTICLE TRANSPARENCY & CONTENT REPORTING ENHANCEMENTS
-- Adds editorial provenance, source attribution, correction tracking,
-- and public content reporting support to contents and reports tables.
-- ==========================================================

-- 1. Contents Table Transparency & Attribution Columns
ALTER TABLE public.contents
    ADD COLUMN IF NOT EXISTS author_name TEXT,
    ADD COLUMN IF NOT EXISTS source_name TEXT,
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS media_attribution TEXT,
    ADD COLUMN IF NOT EXISTS is_original BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS correction_note TEXT,
    ADD COLUMN IF NOT EXISTS correction_status TEXT DEFAULT 'NONE' CHECK (correction_status IN ('NONE', 'CORRECTED', 'RETRACTED'));

CREATE INDEX IF NOT EXISTS idx_contents_source_name ON public.contents(source_name);
CREATE INDEX IF NOT EXISTS idx_contents_correction_status ON public.contents(correction_status);

-- 2. Reports Table Enhancements
ALTER TABLE public.reports ALTER COLUMN content_id DROP NOT NULL;
ALTER TABLE public.reports
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'OTHER' CHECK (category IN (
        'INCORRECT_INFO',
        'MISLEADING',
        'COPYRIGHT',
        'PRIVACY',
        'HARASSMENT',
        'ILLEGAL_CONTENT',
        'HATE_VIOLENCE',
        'SPAM',
        'OTHER'
    )),
    ADD COLUMN IF NOT EXISTS details TEXT,
    ADD COLUMN IF NOT EXISTS reporter_email TEXT,
    ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS resolution_notes TEXT;

-- 3. RLS for Reports Table: Ensure public/readers can submit reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit content reports" ON public.reports;
CREATE POLICY "Public can submit content reports"
    ON public.reports FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports"
    ON public.reports FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND reporter_id = auth.uid()) OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;
CREATE POLICY "Admins can manage all reports"
    ON public.reports FOR ALL
    USING (public.is_admin());
