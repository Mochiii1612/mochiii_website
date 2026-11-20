import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Each route's <title> and description. index.html carries the home page's,
 * for crawlers that do not run scripts (link previews read it); this hook
 * swaps them, with the Open Graph and Twitter copies and the canonical URL,
 * when the route changes.
 */
export const SITE_URL = 'https://www.mochiii.in';

/** The one-line description, shared with the docs site's home page. */
export const SITE_DESCRIPTION =
  'An AI coding agent that knows your codebase, in VS Code and in your terminal. Mochiii reads your project, answers questions about it, writes and fixes code, runs your tests, and works through long tasks.';

export const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mochiii — an AI coding agent that knows your codebase',
    description: SITE_DESCRIPTION,
  },
  '/mcp': {
    title: 'MCP Marketplace — Mochiii',
    description: 'Verified MCP servers you can add to Mochiii, from the terminal app or from VS Code.',
  },
  '/faq': {
    title: 'FAQ — Mochiii',
    description: 'Answers to common questions about installing Mochiii, using it, and fixing problems.',
  },
  '/support': {
    title: 'Support — Mochiii',
    description: 'Email support, how to report a bug or a security issue, and how to ask for a feature.',
  },
};

function setAttr(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

export function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
    const meta = PAGE_META[path] ?? PAGE_META['/'];
    const url = SITE_URL + (path === '/' ? '/' : path);
    document.title = meta.title;
    setAttr('meta[name="description"]', 'content', meta.description);
    setAttr('meta[property="og:title"]', 'content', meta.title);
    setAttr('meta[property="og:description"]', 'content', meta.description);
    setAttr('meta[property="og:url"]', 'content', url);
    setAttr('meta[name="twitter:title"]', 'content', meta.title);
    setAttr('meta[name="twitter:description"]', 'content', meta.description);
    setAttr('link[rel="canonical"]', 'href', url);
  }, [pathname]);
}
