# Mochiii website

Vite + React + TypeScript. Four routes: `/` (the product page), `/mcp` (the MCP marketplace), `/faq` and `/support`. Deployed as a Cloudflare Worker serving `dist/` as static assets (`wrangler.jsonc`); a new route also needs a line in `public/_redirects`, and its title and description in `src/pageMeta.ts`.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```

## Keeping the page accurate

- `src/site.config.ts` holds the install commands, the provider list and the footer's social links (an icon shows only when its URL is set).
- The "Good to know" section on the home page carries the caveats (prompts go to the model provider, VS Code auto mode, platform coverage, unsigned binaries, licence). When a release changes any of them, update the sentence rather than leaving it stale.

## The lotus

The 3D lotus is a standalone viewer in `public/spz-viewer/`, loaded as an iframe by the hero in `src/pages/Home.tsx`. It is built separately; leave it alone unless you are changing the scene.

## Still to fill in

`src/pages/Support.tsx` still contains unfilled `[[...]]` template placeholders (security contact, response times, docs URL, and others). They need real answers from the maintainer.
