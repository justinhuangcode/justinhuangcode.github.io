# Upgrading This Site Against Aither Releases

This site is a customized production instance of `astro-theme-aither`.

That means:

- New Aither sites should start from the upstream template.
- This repo does not upgrade via `pnpm up astro-theme-aither`.
- The safe upgrade unit is an upstream release tag, for example `v2026.03.20 -> v2026.04.08`.

Because this site lives on the `gh-pages` branch and carries site-specific content/config, the right workflow is a release-to-release diff, not a blind overwrite from upstream `main`.

## Recommended Upgrade Flow

1. Work on `gh-pages`
2. Fetch upstream release tags
3. Review the target release notes and changelog
4. Compare upstream release to upstream release
5. Port theme/runtime changes first
6. Re-apply site-owned customizations intentionally
7. Run `pnpm validate`
8. Preview the production build
9. Ship only after the HTML site and agent-facing protocol still look correct

Suggested local setup:

```bash
git remote add upstream https://github.com/justinhuangai/astro-theme-aither.git
git fetch upstream --tags
pnpm upgrade:diff -- --from v2026.03.20 --to v2026.04.08
```

If you want a clean side-by-side comparison instead:

```bash
git clone --depth 1 --branch v2026.03.20 https://github.com/justinhuangai/astro-theme-aither.git ../aither-v2026.03.20
git clone --depth 1 --branch v2026.04.08 https://github.com/justinhuangai/astro-theme-aither.git ../aither-v2026.04.08
diff -ru ../aither-v2026.03.20 ../aither-v2026.04.08
```

## File Ownership Heuristic

These paths are usually site-owned and deserve extra caution:

- `src/content/`
- `src/config/site.ts`
- `.env` and deployment secrets
- analytics, comments, chat, and domain-specific configuration

These paths are usually theme/runtime-owned and are the first place to look for upstream fixes:

- `.github/workflows/`
- `astro.config.mjs`
- `scripts/`
- `src/components/`
- `src/config/themes.ts`
- `src/content.config.ts`
- `src/i18n/`
- `src/layouts/`
- `src/lib/`
- `src/pages/`
- `src/styles/`

## What To Avoid

- Do not treat this repo like a versioned npm integration.
- Do not overwrite `src/config/site.ts` or `src/content/` without reviewing local intent.
- Do not upgrade from arbitrary upstream `main` commits when a tagged release exists.
- Do not skip `pnpm validate`; protocol regressions are easy to miss if you only inspect the homepage.

## Best Practice

Keep one clean upstream reference around, either:

- a separate local clone checked out to release tags
- or a dedicated internal branch that mirrors pristine Aither releases

That keeps production changes focused on your site while making future theme upgrades much easier to reason about.
