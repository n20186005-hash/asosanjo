# Validation report

Date: 2026-07-30

## Passed locally

- 20 Astro templates have valid frontmatter delimiters.
- 26 TypeScript/frontmatter sections pass TypeScript syntax transpilation.
- Astro/HTML component tag nesting is balanced.
- All 9 internal page routes referenced by literal links exist.
- All local image, icon, and manifest references exist.
- `package.json` and `manifest.webmanifest` parse as valid JSON.
- `astro.config.mjs` passes Node.js syntax validation.
- GA4 measurement ID is configured through `src/config/site.ts` and loaded by `BaseLayout.astro`.
- Domain text appears only in configuration/documentation and is not rendered as visible page copy.
- External page links are limited to official status sources and Creative Commons attribution pages.

## Build limitation in this environment

`pnpm install`, `pnpm check`, and `pnpm build` could not be executed because the available npm registry does not contain the requested packages, while direct access to the public npm registry failed with DNS/network errors. This is an environment/network limitation rather than a reported source-code build error.

Run the following in a normal networked development environment:

```bash
corepack enable
pnpm install
pnpm check
pnpm build
```
