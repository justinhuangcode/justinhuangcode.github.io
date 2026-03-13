import { createMarkdownStaticPaths, createMarkdownResponse } from '@/lib/markdown-endpoint';

export const getStaticPaths = createMarkdownStaticPaths('it');

export function GET({ props }: { props: { postId: string } }) {
  return createMarkdownResponse(props.postId);
}
