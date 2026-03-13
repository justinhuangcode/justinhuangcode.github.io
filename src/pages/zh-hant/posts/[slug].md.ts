import { createMarkdownStaticPaths, createMarkdownResponse } from '@/lib/markdown-endpoint';

export const getStaticPaths = createMarkdownStaticPaths('zh-hant');

export function GET({ props }: { props: { postId: string } }) {
  return createMarkdownResponse(props.postId);
}
