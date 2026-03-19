import { createMarkdownResponse } from '@/lib/markdown-endpoint';
import { nonDefaultLocales } from '@/i18n';
import { getPostsByLocale, getSlug } from '@/lib/posts';

export async function getStaticPaths() {
  const paths: Array<{ params: { locale: string; slug: string }; props: { postId: string } }> = [];

  for (const locale of nonDefaultLocales) {
    const posts = await getPostsByLocale(locale);
    posts.forEach((post) => {
      paths.push({
        params: { locale, slug: getSlug(post.id) },
        props: { postId: post.id },
      });
    });
  }

  return paths;
}

export function GET({ props }: { props: { postId: string } }) {
  return createMarkdownResponse(props.postId);
}
