import { addClassName, getClassNames, h, select } from 'expressive-code/hast';

const LANGUAGE_LABELS = new Map([
  ['bash', 'Bash'],
  ['c', 'C'],
  ['cpp', 'C++'],
  ['csharp', 'C#'],
  ['cs', 'C#'],
  ['css', 'CSS'],
  ['dockerfile', 'Dockerfile'],
  ['fish', 'Fish'],
  ['go', 'Go'],
  ['graphql', 'GraphQL'],
  ['html', 'HTML'],
  ['ini', 'INI'],
  ['java', 'Java'],
  ['javascript', 'JavaScript'],
  ['json', 'JSON'],
  ['jsx', 'JSX'],
  ['kotlin', 'Kotlin'],
  ['make', 'Makefile'],
  ['makefile', 'Makefile'],
  ['markdown', 'Markdown'],
  ['md', 'Markdown'],
  ['php', 'PHP'],
  ['plaintext', 'Text'],
  ['py', 'Python'],
  ['python', 'Python'],
  ['rb', 'Ruby'],
  ['rs', 'Rust'],
  ['ruby', 'Ruby'],
  ['rust', 'Rust'],
  ['sh', 'Shell'],
  ['shell', 'Shell'],
  ['shellscript', 'Shell'],
  ['sql', 'SQL'],
  ['swift', 'Swift'],
  ['toml', 'TOML'],
  ['ts', 'TypeScript'],
  ['tsx', 'TSX'],
  ['txt', 'Text'],
  ['typescript', 'TypeScript'],
  ['yaml', 'YAML'],
  ['yml', 'YAML'],
  ['zsh', 'Zsh'],
]);

function formatLanguageLabel(language) {
  const normalized = language?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (LANGUAGE_LABELS.has(normalized)) {
    return LANGUAGE_LABELS.get(normalized);
  }

  if (normalized.includes('++')) {
    return normalized.toUpperCase();
  }

  if (normalized.length <= 4) {
    return normalized.toUpperCase();
  }

  return normalized
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function createLanguageBadge(label) {
  return h(
    'span',
    {
      className: ['aither-ec-language'],
      'aria-label': `Language: ${label}`,
    },
    label,
  );
}

export function pluginAitherCodeLanguage() {
  return {
    name: 'Aither Code Language',
    baseStyles: ({ cssVar }) => `
      .frame {
        &.aither-has-language-header:not(.is-terminal) .header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: calc(${cssVar('uiPaddingBlock')} * 0.82) ${cssVar('uiPaddingInline')};
          border: ${cssVar('borderWidth')} solid ${cssVar('borderColor')};
          border-bottom: none;
          background: color-mix(
            in srgb,
            var(--code-background, ${cssVar('codeBackground')}) 92%,
            ${cssVar('frames.inlineButtonForeground')} 8%
          );
        }

        &.aither-has-language-header:not(.is-terminal) pre,
        &.aither-has-language-header:not(.is-terminal) code {
          border-top: none;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        & .aither-ec-language {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          min-height: 1.65rem;
          max-width: min(12rem, calc(100% - 5rem));
          padding-inline: 0.5rem;
          overflow: hidden;
          border: ${cssVar('borderWidth')} solid color-mix(in srgb, ${cssVar('borderColor')} 88%, transparent);
          border-radius: 999px;
          background: color-mix(
            in srgb,
            var(--code-background, ${cssVar('codeBackground')}) 88%,
            ${cssVar('frames.inlineButtonForeground')} 12%
          );
          color: ${cssVar('codeForeground')};
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &.aither-has-language-header .header {
          gap: 0.75rem;
        }

        &.aither-has-language-header:not(.is-terminal) .aither-ec-language {
          margin-inline-start: auto;
        }

        &.is-terminal.aither-has-language-header .aither-ec-language {
          position: absolute;
          inset-inline-end: ${cssVar('uiPaddingInline')};
        }

        @media (max-width: 720px) {
          & .aither-ec-language {
            min-height: 1.55rem;
            max-width: min(10rem, calc(100% - 4.5rem));
            padding-inline: 0.45rem;
            font-size: 0.68rem;
          }
        }
      }
    `,
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        codeBlock.props.aitherLanguageLabel =
          codeBlock.metaOptions.getString('languageLabel') ??
          formatLanguageLabel(codeBlock.language);
        codeBlock.props.aitherShowLanguage = codeBlock.metaOptions.getBoolean('showLanguage');
      },
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const languageLabel = codeBlock.props.aitherLanguageLabel;

        if (!languageLabel) {
          return;
        }

        const blockAst = renderData.blockAst;
        const header = select('figcaption.header', blockAst);
        const rootClassNames = getClassNames(blockAst);
        const hasVisibleHeader =
          Boolean(codeBlock.props.title) || rootClassNames.includes('is-terminal');
        const showLanguage = codeBlock.props.aitherShowLanguage ?? hasVisibleHeader;

        if (!showLanguage || !header) {
          return;
        }

        addClassName(blockAst, 'aither-has-language-header');
        header.children.push(createLanguageBadge(languageLabel));
      },
    },
  };
}
