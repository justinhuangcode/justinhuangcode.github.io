import { forwardRef, type ReactNode, type SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  color?: string;
  size?: number | string;
  title?: string;
}

interface BaseIconProps extends IconProps {
  children: ReactNode;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  viewBox?: string;
}

const BaseIcon = forwardRef<SVGSVGElement, BaseIconProps>(function BaseIcon(
  {
    children,
    className,
    color,
    fill = 'none',
    size = 20,
    stroke = 'currentColor',
    strokeWidth = 2,
    style,
    title,
    viewBox = '0 0 24 24',
    ...props
  },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={color ? { color, ...style } : style}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
});

function createStrokeIcon(
  displayName: string,
  children: ReactNode,
  options?: Pick<BaseIconProps, 'viewBox' | 'strokeWidth'>,
) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
    return (
      <BaseIcon ref={ref} {...options} {...props}>
        {children}
      </BaseIcon>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

function createFilledIcon(
  displayName: string,
  children: ReactNode,
  options?: Pick<BaseIconProps, 'viewBox'>,
) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
    return (
      <BaseIcon
        ref={ref}
        fill="currentColor"
        stroke="none"
        {...options}
        {...props}
      >
        {children}
      </BaseIcon>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

export const IconSun = createStrokeIcon(
  'IconSun',
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5" />
    <path d="M12 19.5V22" />
    <path d="M4.93 4.93 6.7 6.7" />
    <path d="M17.3 17.3 19.07 19.07" />
    <path d="M2 12h2.5" />
    <path d="M19.5 12H22" />
    <path d="M4.93 19.07 6.7 17.3" />
    <path d="M17.3 6.7 19.07 4.93" />
  </>,
);

export const IconMoon = createFilledIcon(
  'IconMoon',
  <path d="M20.7 14.2A8.8 8.8 0 0 1 9.8 3.3a.75.75 0 0 0-.95-.95A10.3 10.3 0 1 0 21.65 15.15a.75.75 0 0 0-.95-.95Z" />,
);

export const IconMonitor = createStrokeIcon(
  'IconMonitor',
  <>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
  </>,
);

export const IconMenu = createStrokeIcon(
  'IconMenu',
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
);

export const IconX = createStrokeIcon(
  'IconX',
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>,
);

export const IconLanguage = createStrokeIcon(
  'IconLanguage',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18" />
    <path d="M12 3a14 14 0 0 0 0 18" />
  </>,
);

export const IconChevronRight = createStrokeIcon(
  'IconChevronRight',
  <path d="m9 6 6 6-6 6" />,
);

export const IconChevronDown = createStrokeIcon(
  'IconChevronDown',
  <path d="m6 9 6 6 6-6" />,
);

export const IconPalette = createFilledIcon(
  'IconPalette',
  <>
    <path d="M0 5.25136V4.2487L0.463236 4.05702L7.71324 1.05702L8 0.938354L8.28676 1.05702L15.5368 4.05702L16 4.2487V5.25136L15.5368 5.44304L8.28676 8.44304L8 8.5617L7.71324 8.44304L0.463236 5.44304L0 5.25136ZM0 8.45825V6.83491L0.536764 7.05702L8 10.1453L15.4632 7.05702L16 6.83491V8.45825L8.28676 11.6499L8 11.7686L7.71324 11.6499L0 8.45825ZM0 11.7083V10.0849L0.536764 10.307L8 13.3953L15.4632 10.307L16 10.0849V11.7083L8.28676 14.8999L8 15.0186L7.71324 14.8999L0 11.7083ZM8 6.93835L2.71154 4.75003L8 2.5617L13.2885 4.75003L8 6.93835Z" />
  </>,
  { viewBox: '0 0 16 16' },
);

export const IconClose = IconX;

export const IconArrowLeft = createStrokeIcon(
  'IconArrowLeft',
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>,
);

export const IconArrowRight = createStrokeIcon(
  'IconArrowRight',
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>,
);

export const IconMessage = createStrokeIcon(
  'IconMessage',
  <>
    <path d="M7 17.5H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4.5 3.5V17.5Z" />
  </>,
);

export const IconMail = createStrokeIcon(
  'IconMail',
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>,
);

export const IconRss = createStrokeIcon(
  'IconRss',
  <>
    <path d="M5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path d="M4 10a10 10 0 0 1 10 10" />
    <path d="M4 5a15 15 0 0 1 15 15" />
  </>,
);

export const IconUser = createStrokeIcon(
  'IconUser',
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </>,
);

export const IconGithub = createFilledIcon(
  'IconGithub',
  <path d="M12 2C6.48 2 2 6.6 2 12.27c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.2-3.37-1.2-.46-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.45.11 2.71.64.72 1.02 1.63 1.02 2.75 0 3.96-2.33 4.83-4.56 5.08.36.32.68.95.68 1.93 0 1.4-.01 2.52-.01 2.86 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.27C22 6.6 17.52 2 12 2Z" />,
);

export const IconTwitterX = createFilledIcon(
  'IconTwitterX',
  <path d="M4.2 4h4.07l3.18 4.45L15.63 4H19l-5.87 6.7L20 20h-4.1l-3.43-4.8L8.1 20H4.72l6.08-6.93L4.2 4Zm3.16 1.95H6.55l9.1 12.1h.82L7.36 5.95Z" />,
);

export const IconDiscord = createFilledIcon(
  'IconDiscord',
  <path d="M18.2 5.4A15.2 15.2 0 0 0 14.4 4l-.18.36c1.46.38 2.12.93 2.12.93a8.1 8.1 0 0 0-2.69-.82 9.2 9.2 0 0 0-1.66-.14 8.8 8.8 0 0 0-4.31.96s.63-.5 1.96-.88L9.46 4a15.1 15.1 0 0 0-3.8 1.4C3.24 9 2.58 12.5 2.58 12.5A15.4 15.4 0 0 0 7.24 15l.99-1.4a9.7 9.7 0 0 1-1.56-.75c.13.1.27.19.42.28 1.3.8 2.86 1.17 4.41 1.17 1.55 0 3.11-.37 4.41-1.17l.42-.28c-.5.3-1.02.55-1.56.75l.99 1.4a15.3 15.3 0 0 0 4.66-2.5s-.66-3.5-3.08-7.1ZM9.42 11.38c-.72 0-1.3-.68-1.3-1.51 0-.84.58-1.52 1.3-1.52.73 0 1.31.68 1.3 1.52 0 .83-.58 1.5-1.3 1.5Zm5.16 0c-.72 0-1.3-.68-1.3-1.51 0-.84.58-1.52 1.3-1.52.73 0 1.31.68 1.3 1.52 0 .83-.58 1.5-1.3 1.5Z" />,
);
