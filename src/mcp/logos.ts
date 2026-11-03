// Logos for the verified servers, by catalog id. Each file in public/mcp-logos/
// was taken from the product's own site; the catalog itself carries no logo.
// A server missing here shows a letter tile instead.
//
//   mcp.png              modelcontextprotocol.io (its touch icon)
//   git.svg              git-scm.com/images/logos/downloads/Git-Icon-1788C.svg (Jason Long, CC BY 3.0)
//   github.svg           github.githubassets.com/favicons/favicon.svg
//   postgres.png         postgresql.org/media/img/about/press/elephant.png
//   sqlite.svg           sqlite.org/images/sqlite370_banner.svg
//   playwright.svg       playwright.dev/img/playwright-logo.svg
//   chrome-devtools.png  github.com/ChromeDevTools (the project's own avatar)
//   context7.png         context7.com/favicon.ico
//   eslint.svg           eslint.org/icon.svg
//   next-devtools.png    nextjs.org/favicon.ico
//   nx.png               nx.dev (its light-theme icon)
//   mongodb.png          mongodb.com/assets/images/global/favicon.ico
//   redis.png            redis.io/apple-icon.png
//   terraform.svg        developer.hashicorp.com icon set (flight-terraform-color-24)

const MCP = '/mcp-logos/mcp.png';

const LOGOS: Record<string, string> = {
  filesystem: MCP,
  fetch: MCP,
  memory: MCP,
  'sequential-thinking': MCP,
  git: '/mcp-logos/git.svg',
  github: '/mcp-logos/github.svg',
  postgres: '/mcp-logos/postgres.png',
  sqlite: '/mcp-logos/sqlite.svg',
  playwright: '/mcp-logos/playwright.svg',
  'chrome-devtools': '/mcp-logos/chrome-devtools.png',
  context7: '/mcp-logos/context7.png',
  eslint: '/mcp-logos/eslint.svg',
  'next-devtools': '/mcp-logos/next-devtools.png',
  nx: '/mcp-logos/nx.png',
  mongodb: '/mcp-logos/mongodb.png',
  redis: '/mcp-logos/redis.png',
  terraform: '/mcp-logos/terraform.svg',
};

export function logoFor(id: string): string | undefined {
  return LOGOS[id];
}
