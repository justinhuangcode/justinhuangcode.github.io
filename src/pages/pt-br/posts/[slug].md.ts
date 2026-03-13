import { createMarkdownStaticPaths, createMarkdownResponse } from '@/lib/markdown-endpoint';

export const getStaticPaths = createMarkdownStaticPaths('pt-br');

export function GET({ props }: { props: { postId: string } }) {
  return createMarkdownResponse(props.postId);
}
