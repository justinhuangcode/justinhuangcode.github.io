/**
 * Geist Design System icons (Vercel).
 *
 * Characteristics:
 * - viewBox: 0 0 16 16
 * - fill-based (not stroke)
 * - 16×16 native size
 *
 * Source: vercel-geist-icons (extracted from vercel.com/geist/icons)
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 16,
  height: 16,
  fill: 'currentColor',
  viewBox: '0 0 16 16',
  style: { pointerEvents: 'none' },
};

export function IconSun(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.75.75V0h-1.5v2h1.5V.75M3.26 4.32l-.53-.53-.35-.35-.53-.53L2.9 1.85l.53.53.35.35.53.53zm8.42-1.06.53-.53.35-.35.53-.53 1.06 1.06-.53.53-.35.35-.53.53zM8 11.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5m0 1.5a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5m6-5.5h2v1.5h-2zm-13.25 0H0v1.5h2v-1.5H.75m1.62 5.32-.53.53 1.06 1.06.53-.53.35-.35.53-.53-1.06-1.06-.53.53zm10.2 1.06.53.53 1.06-1.06-.53-.53-.35-.35-.53-.53-1.06 1.06.53.53zM8.75 14v2h-1.5v-2z" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1.5 8a6 6 0 0 1 3.62-5.51 7 7 0 0 0 7.08 9.25A5.99 5.99 0 0 1 1.5 8M6.42.58a7.5 7.5 0 1 0 7.96 10.41l-.92-1.01a5.5 5.5 0 0 1-6.3-8.25zm6.83.42v1.75H15v1.5h-1.75V6h-1.5V4.25H10v-1.5h1.75V1z" />
    </svg>
  );
}

export function IconMonitor(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H8.75v3h1.75V16h-5v-1.5h1.75v-3H1a1 1 0 0 1-1-1zm1.5.5V10h13V2.5z" />
    </svg>
  );
}

export function IconLanguage(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 -960 960 960"
      style={{ pointerEvents: 'none' }}
      {...props}
    >
      <path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M1.75 4H1v1.5h14V4zm0 6.5H1V12h14v-1.5z" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m9.97 11.03.53.53 1.06-1.06-.53-.53L9.06 8l1.97-1.97.53-.53-1.06-1.06-.53.53L8 6.94 6.03 4.97l-.53-.53L4.44 5.5l.53.53L6.94 8 4.97 9.97l-.53.53 1.06 1.06.53-.53L8 9.06z" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m6.47 13.78.53.53 1.06-1.06-.53-.53-3.97-3.97H15v-1.5H3.56l3.97-3.97.53-.53L7 1.69l-.53.53-5.074 5.073a1 1 0 0 0 0 1.414z" />
    </svg>
  );
}
