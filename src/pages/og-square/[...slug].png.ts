import { getPostsByLocale, getSlug } from '@/lib/posts';
import { generateOgImage } from '@/lib/og-image';
import { formatDate } from '@/lib/formatter';
import { defaultLocale, locales } from '@/i18n';

export async function getStaticPaths() {
  const paths = [];
  for (const locale of locales) {
    const posts = await getPostsByLocale(locale);
    for (const post of posts) {
      const slug = getSlug(post.id);
      const prefix = locale === defaultLocale ? '' : `${locale}/`;
      paths.push({
        params: { slug: `${prefix}${slug}` },
        props: {
          title: post.data.title,
          date: formatDate(post.data.date),
          category: post.data.category,
        },
      });
    }
  }
  return paths;
}

export async function GET({ props }: { props: { title: string; date: string; category: string } }) {
  const png = await generateOgImage({
    title: props.title,
    date: props.date,
    category: props.category,
    variant: 'square',
  });

  return new Response(Buffer.from(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
