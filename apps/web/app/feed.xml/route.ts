import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naagrik.news';

    const { data: articles, error } = await supabase
      .from('contents')
      .select('id, title, description, type, media_url, thumbnail_url, location_state, location_district, created_at, published_at')
      .in('moderation_status', ['PUBLISHED', 'APPROVED'])
      .order('created_at', { ascending: false })
      .limit(30);

    const itemsXml = (articles || []).map((art) => {
      const articleUrl = `${siteUrl}/news/${art.id}`;
      const pubDate = new Date(art.published_at || art.created_at).toUTCString();
      const location = [art.location_district, art.location_state].filter(Boolean).join(', ');
      const desc = art.description ? `${location ? `[${location}] ` : ''}${art.description}` : 'Hyperlocal Indian reporting on Naagrik.';
      const media = art.thumbnail_url || art.media_url;

      return `
    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
      ${media ? `<enclosure url="${escapeXml(media)}" length="0" type="${media.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'}" />` : ''}
    </item>`;
    }).join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Naagrik Hyperlocal News</title>
    <link>${siteUrl}</link>
    <description>Citizen-powered hyperlocal journalism from across India</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (err: any) {
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(err.message)}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
}
