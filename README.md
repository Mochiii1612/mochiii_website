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
- The home page's platform line comes from `PLATFORMS` in `src/site.config.ts`; the proof strip counts the verified servers in `public/api/mcp/v1/catalog.json` at build time. The caveats that used to be in "Good to know" are on the FAQ page.

## Screenshots

The home page's screenshots in `src/assets/shots/` are real captures of Mochiii 1.6.0 answering with a model on the same computer (qwen2.5-coder:7b in Ollama), in the terminal app and in VS Code. Replace them with new captures when the product's look changes; never with mock-ups.

## Still to fill in

`src/pages/Support.tsx` still contains unfilled `[[...]]` template placeholders (security contact, response times, docs URL, and others). They need real answers from the maintainer.
