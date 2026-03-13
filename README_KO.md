# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | **한국어** | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[라이브 미리보기](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## 왜 Aither인가?

좋은 글에는 좋은 타이포그래피가 필요합니다. 대부분의 테마는 히어로 이미지, 애니메이션, UI 장식 아래에 글을 묻어버립니다. Aither는 정반대 — 텍스트 자체를 디자인으로 삼습니다.

Bricolage Grotesque 헤딩과 깔끔한 산세리프 타이포그래피, 세심하게 조정된 읽기 리듬, 방해하지 않는 레이아웃. 모든 것이 하나의 목표를 위해 존재합니다: 글을 아름답게 보이고 읽히게 만드는 것.

## 기능

- **산세리프 타이포그래피** -- Bricolage Grotesque 헤딩에 system-ui 본문, CJK 인식 폴백(PingFang SC, Microsoft YaHei), macOS, Windows, Linux, Android 전체 일관
- **다크 모드** -- 라이트 / 다크 / 시스템 전환, localStorage 지속, View Transitions API 원형 공개 애니메이션
- **Tailwind CSS v4** -- 유틸리티 우선 스타일링, `@theme` 디자인 토큰, 쉬운 커스터마이징
- **11개 언어 i18n** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **동적 OG 이미지** -- Satori + resvg-js를 통한 게시글별 자동 Open Graph 이미지 생성
- **Giscus 댓글** -- GitHub Discussions 기반 댓글 시스템
- **Crisp 채팅** -- 선택적 실시간 채팅 위젯
- **카테고리 및 태그** -- 게시글 분류 및 선택적 태그 지원
- **고정 게시글** -- frontmatter에서 `pinned: true` 설정으로 상단 고정
- **페이지네이션** -- 블로그 목록 페이지 크기 설정 가능
- **목차** -- 게시글 헤딩에서 자동 생성
- **저자 정보** -- 설정 가능한 저자 이름 및 아바타
- **AI 네이티브 엔드포인트** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json`, 게시글별 `.md` 엔드포인트
- **RSS 피드** -- `@astrojs/rss` 기반 내장 `/rss.xml`
- **사이트맵** -- `@astrojs/sitemap`으로 자동 생성
- **SEO** -- Open Graph 메타 태그, canonical URL, 게시글별 description, OpenSearch
- **반응형** -- 모바일 친화적 레이아웃, 화면 크기별 읽기 리듬 유지
- **Google Analytics** -- 선택적, `PUBLIC_GA_ID` 환경 변수로 제로 설정 활성화
- **Astro Content Collections** -- Zod 스키마 검증이 포함된 타입 안전 Markdown 게시글
- **GitHub Pages** -- 자동 배포를 위한 CI/CD 워크플로우 포함

## 빠른 시작

### GitHub 템플릿 사용

1. [GitHub](https://github.com/justinhuangcode/astro-theme-aither)에서 **"Use this template"** 클릭
2. 새 저장소 클론:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. 의존성 설치:

```bash
pnpm install
```

4. 사이트 설정:

```bash
# astro.config.mjs -- 사이트 URL 설정
site: 'https://your-domain.com'

# src/config/site.ts -- 이름, 설명, 소셜 링크, 내비게이션, 푸터 설정
```

5. 환경 변수 설정 (선택):

```bash
cp .env.example .env
# .env에 값 입력 (GA, Giscus, Crisp)
```

6. 작성 시작:

```bash
pnpm dev
```

7. 배포: `main`에 푸시하면 GitHub Actions가 자동으로 빌드 및 배포합니다.

### 수동 설치

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## 게시글 형식

`src/content/posts/{locale}/`에 Markdown 파일을 생성하세요:

```markdown
---
title: 게시글 제목
date: 2026-01-01
description: SEO용 선택적 설명
category: Technology
tags: [선택적, 태그]
pinned: false
image: ./optional-cover.jpg
---

내용을 여기에 작성하세요.
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| `title` | string | 예 | -- | 게시글 제목 |
| `date` | date | 예 | -- | 발행일 (YYYY-MM-DD) |
| `description` | string | 아니오 | -- | RSS 피드 및 메타 태그에 사용 |
| `category` | string | 아니오 | `"General"` | 게시글 카테고리 |
| `tags` | string[] | 아니오 | -- | 게시글 태그 |
| `pinned` | boolean | 아니오 | `false` | `true`면 목록 상단에 고정 |
| `image` | image | 아니오 | -- | 커버 이미지 (상대 경로 또는 import) |

## 명령어

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 로컬 개발 서버 시작 |
| `pnpm build` | `dist/`에 정적 사이트 빌드 |
| `pnpm preview` | 프로덕션 빌드 로컬 미리보기 |

## 설정

### 사이트 설정 (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // src/assets/에서 import하여 최적화하거나 URL 문자열 사용
  },
  url: 'https://your-domain.com',
  social: [
    { title: 'GitHub', href: 'https://github.com/...', icon: 'github' },
    { title: 'Twitter', href: '#', icon: 'x' },
  ],
  blog: { paginationSize: 20 },
  analytics: { googleAnalyticsId: import.meta.env.PUBLIC_GA_ID || '' },
  crisp: { websiteId: import.meta.env.PUBLIC_CRISP_WEBSITE_ID || '' },
  ui: { defaultMode: 'dark', enableModeSwitch: true },
  giscus: { repo: '...', repoId: '...', category: '...', categoryId: '...' },
  nav: [
    { labelKey: 'blog', href: '/' },
    { labelKey: 'about', href: '/about' },
  ],
  footer: { copyrightYear: 'auto', sections: [/* ... */] },
};
```

### Astro 설정 (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // RSS 및 사이트맵에 필요
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### 환경 변수 (`.env`)

```bash
# Google Analytics (비워두면 비활성화)
PUBLIC_GA_ID=

# Crisp 채팅 (비워두면 비활성화)
PUBLIC_CRISP_WEBSITE_ID=

# Giscus 댓글 (모두 비워두면 비활성화)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

언어 설정은 `src/i18n/index.ts`에, 번역 파일은 `src/i18n/messages/*.ts`에 있습니다.

| 코드 | 언어 |
|---|---|
| `en` | English (기본) |
| `zh-cn` | 简体中文 |
| `zh-tw` | 繁體中文 |
| `ko` | 한국어 |
| `fr` | Français |
| `de` | Deutsch |
| `it` | Italiano |
| `es` | Español |
| `ru` | Русский |
| `id` | Bahasa Indonesia |
| `pt-br` | Português (BR) |

기본 로케일(`en`)은 URL 접두사가 없습니다. 다른 로케일은 코드를 접두사로 사용합니다 (예: `/ko/`, `/zh-cn/`).

## 프로젝트 구조

```
src/
├── config/
│   └── site.ts              # 사이트 이름, 소셜 링크, 내비게이션, 푸터, 분석, Giscus, Crisp
├── content.config.ts         # Content Collections 스키마 (Zod)
├── i18n/
│   ├── index.ts              # 로케일 정의, getMessages(), 라우팅 헬퍼
│   └── messages/             # 번역 파일 (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # 글로벌 레이아웃 (head, 내비게이션, 테마 전환, 분석)
├── components/
│   ├── Navbar.astro          # Bootstrap 3 스타일 그래디언트 내비바
│   ├── BlogGrid.astro        # 페이지네이션이 포함된 게시글 그리드
│   ├── BlogCard.astro        # 카테고리, 태그, 날짜가 포함된 게시글 카드
│   ├── TableOfContents.astro # 헤딩에서 자동 생성된 목차
│   ├── AuthorInfo.astro      # 저자 이름 및 아바타
│   ├── Giscus.astro          # GitHub Discussions 댓글
│   ├── Crisp.astro           # Crisp 채팅 위젯
│   ├── Analytics.astro       # Google Analytics 스크립트
│   ├── Prose.astro           # 게시글 콘텐츠 타이포그래피 래퍼
│   └── react/                # React 컴포넌트 (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # 홈 (English, 기본 로케일)
│   ├── about.astro           # 소개 페이지
│   ├── page/                 # 페이지네이션된 블로그 목록
│   ├── posts/
│   │   ├── [slug].astro      # 게시글 상세 (English)
│   │   └── [slug].md.ts      # 게시글별 Markdown 엔드포인트 (AI용)
│   ├── og/                   # 동적 OG 이미지 생성
│   ├── rss.xml.ts            # RSS 피드
│   ├── llms.txt.ts           # AI 에이전트 친화적 llms.txt
│   ├── llms-full.txt.ts      # LLM을 위한 전체 콘텐츠
│   ├── skill.md.ts           # AI 스킬 디스크립터
│   ├── api/
│   │   └── posts.json.ts     # 게시글 JSON API
│   └── {locale}/             # 각 지원 로케일의 페이지
├── content/
│   └── posts/
│       ├── en/*.md           # English 게시글 (기본 로케일)
│       └── {locale}/*.md     # 각 지원 로케일의 게시글
└── styles/
    └── global.css            # Tailwind CSS v4 @theme 토큰 + 기본 스타일
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-github-pages.yml     # GitHub Pages 배포 (기본)
```

## 배포

### GitHub Pages (기본)

포함된 워크플로우(`.github/workflows/deploy-github-pages.yml`)가 자동으로 배포합니다:

1. 저장소 **Settings** > **Pages** > **Source**에서 **GitHub Actions** 선택
2. `astro.config.mjs`의 `site`를 GitHub Pages URL로 업데이트
3. `main`에 푸시 — 사이트가 자동으로 배포됩니다

### 기타 플랫폼

출력은 `dist/`의 정적 HTML이므로 어디든 배포할 수 있습니다:

```bash
pnpm build
# dist/를 Netlify, Vercel 또는 아무 정적 호스팅에 업로드
```

## 디자인 철학

1. **타이포그래피가 디자인이다** -- Bricolage Grotesque 산세리프 헤딩, system-ui 깔끔한 본문, 세심하게 조정된 읽기 리듬. 서체가 곧 시각적 아이덴티티.
2. **텍스트는 아름답다** -- 잘 조판된 텍스트가 조용한 페이지 위에 있는 것, 그것이 가장 우아한 인터페이스.
3. **어디서나 작동** -- CJK 인식 폴백(PingFang SC, Microsoft YaHei)이 포함된 크로스 플랫폼 폰트 스택. 웹 폰트 로딩 지연 없음, 레이아웃 시프트 없음.
4. **AI 네이티브** -- llms.txt, 구조화된 엔드포인트, 기계 판독 가능 콘텐츠로 1등급 LLM 발견 가능성.
5. **정교하지만 복잡하지 않다** -- Tailwind CSS v4 `@theme` 디자인 토큰으로 쉬운 커스터마이징. 하나의 설정 파일(`src/config/site.ts`)이 전체 사이트를 제어.

## 감사

[yinwang.org](https://www.yinwang.org)에서 영감을 받았습니다.

## 기여

기여를 환영합니다. 변경하고 싶은 내용에 대해 먼저 이슈를 열어주세요.

## 라이선스

[MIT](LICENSE)
