import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from '@/config/site';

const scFontPath = resolve(process.cwd(), 'src/assets/fonts/noto-sans-sc-700.woff');
const scFontData = readFileSync(scFontPath);

const latinFontPath = resolve(process.cwd(), 'src/assets/fonts/noto-sans-700-static.ttf');
const latinFontData = readFileSync(latinFontPath);

const krFontPath = resolve(process.cwd(), 'src/assets/fonts/noto-sans-kr-700-static.ttf');
const krFontData = readFileSync(krFontPath);

const emojiPath = resolve(process.cwd(), 'src/assets/emoji/writing-hand.png');
const emojiBase64 = `data:image/png;base64,${readFileSync(emojiPath).toString('base64')}`;

function stripEmoji(text: string): string {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
}

export async function generateOgImage(opts: {
  title: string;
  date?: string;
  category?: string;
  variant?: 'landscape' | 'square';
}): Promise<Buffer> {
  const {
    title: rawTitle,
    date,
    category,
    variant = 'landscape',
  } = opts;
  const title = stripEmoji(rawTitle);
  const isSquare = variant === 'square';
  const width = 1200;
  const height = isSquare ? 1200 : 630;
  const fontSize = isSquare
    ? title.length > 50 ? 44 : title.length > 30 ? 56 : 68
    : title.length > 50 ? 40 : title.length > 30 ? 48 : 56;
  const horizontalPadding = isSquare ? '88px' : '72px';
  const verticalPadding = isSquare ? '88px' : '56px';
  const titlePaddingRight = isSquare ? '0px' : '20px';

  const svg = await satori(
    // @ts-expect-error satori accepts object-style VNodes
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #007AFF 0%, #0055CC 100%)',
          color: '#ffffff',
          fontFamily: 'Noto Sans SC, Noto Sans KR, Noto Sans',
          padding: `${verticalPadding} ${horizontalPadding}`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                ...(category
                  ? [{
                      type: 'div' as const,
                      props: {
                        style: {
                          fontSize: '16px',
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          padding: '6px 16px',
                          borderRadius: '100px',
                          fontWeight: 700,
                        },
                        children: category,
                      },
                    }]
                  : []),
                ...(date
                  ? [{
                      type: 'span' as const,
                      props: {
                        style: { fontSize: '16px', color: 'rgba(255,255,255,0.7)' },
                        children: date,
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: `${fontSize}px`,
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                paddingRight: titlePaddingRight,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: emojiBase64,
                          width: 28,
                          height: 28,
                          style: {
                            width: '28px',
                            height: '28px',
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#ffffff',
                          },
                          children: siteConfig.name,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: 'rgba(255,255,255,0.6)',
                    },
                    children: siteConfig.url.replace(/^https?:\/\//, ''),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: 'Noto Sans SC',
          data: scFontData,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Noto Sans KR',
          data: krFontData,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Noto Sans',
          data: latinFontData,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });
  return resvg.render().asPng();
}
