# Maintaining This Site

This repository intentionally uses different branches for different jobs:

- `main`: outward-facing repository branch for the public GitHub homepage and lightweight project description
- `gh-pages`: source of truth for the deployed Astro site and the GitHub Pages workflow
- temporary branches such as `source`: disposable experiments only, not part of the normal release flow

## What To Change

When you update the actual site, work on `gh-pages`:

- `src/config/site.ts` for site identity, nav, analytics, comments, and UI defaults
- `src/content/` for posts and pages
- `public/` for static assets
- `.github/workflows/deploy-github-pages.yml` for deployment behavior

Keep `main` intentionally small unless you want to change the repo landing page itself.

## Deployment Flow

1. Switch to `gh-pages`
2. Pull the latest remote state
3. Make the site change
4. Run `pnpm validate`
5. Commit and push to `origin/gh-pages`
6. Wait for the GitHub Pages workflow to finish
7. Verify the live site and key machine endpoints

The workflow is configured to deploy only from `gh-pages`, and it can also be re-run manually from the Actions tab.

## Theme Upgrade Flow

This site is an instance of `astro-theme-aither`, but it does not use `main` as the site source branch. For upgrades:

1. Work on `gh-pages`
2. Fetch the upstream theme tags locally
3. Compare the target release against the current site code
4. Apply the theme-layer changes you want to adopt
5. Re-run `pnpm validate`
6. Push to `gh-pages`
7. Verify the GitHub Pages deployment and the live URLs

For the release-to-release workflow and file-ownership heuristic, see [UPGRADING.md](./UPGRADING.md).

Suggested local setup:

```bash
git remote add upstream https://github.com/justinhuangcode/astro-theme-aither.git
git fetch upstream --tags
```

## Validation Checklist

Run this before every deploy:

```bash
pnpm validate
```

That currently covers:

- `node scripts/check-post-coverage.mjs`
- `node scripts/check-post-math-markup.mjs`
- `astro check`
- `tsc --noEmit`
- `astro build`
- `node scripts/smoke-agent-protocol.mjs`

After deploy, verify at least:

- home page
- one localized page
- one post page
- `/api/posts.json`
- `/rss.xml`
- `/llms.txt`
- `/protocol.json`
- `/agent/home.json`

## Notes

- GitHub Pages HTML can be cached briefly, so prefer checking response headers or machine-readable endpoints instead of relying on a visual refresh alone.
- The local `upstream` remote is a developer convenience. It is not stored by GitHub and must be added per clone.
- Locale metadata now lives in `config/locale-meta.mjs`; keep Astro config, runtime i18n, and validation scripts aligned by updating that file first.
