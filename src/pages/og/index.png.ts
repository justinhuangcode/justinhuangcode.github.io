import { generateOgImage } from '@/lib/og-image';
import { siteConfig } from '@/config/site';

export async function GET() {
  const png = await generateOgImage({
    title: siteConfig.title,
  });

  return new Response(Buffer.from(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
