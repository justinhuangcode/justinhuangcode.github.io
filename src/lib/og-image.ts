import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from '@/config/site';

const fontPath = resolve(process.cwd(), 'src/assets/fonts/noto-sans-sc-700.woff');
const fontData = readFileSync(fontPath);

const emojiPath = resolve(process.cwd(), 'src/assets/emoji/writing-hand.png');
const emojiBase64 = `data:image/png;base64,${readFileSync(emojiPath).toString('base64')}`;

function stripEmoji(text: string): string {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
}

export async function generateOgImage(opts: {
  title: string;
  date?: string;
  category?: string;
}): Promise<Buffer> {
  const { title: rawTitle, date, category } = opts;
  const title = stripEmoji(rawTitle);
  const fontSize = title.length > 50 ? 40 : title.length > 30 ? 48 : 56;

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
          fontFamily: 'Noto Sans SC',
          padding: '56px 72px',
        },
        children: [
          // Top: category pill + date
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
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: `${fontSize}px`,
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                paddingRight: '20px',
              },
              children: title,
            },
          },
          // Bottom: logo + site name | domain
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
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans SC',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  return resvg.render().asPng();
}
