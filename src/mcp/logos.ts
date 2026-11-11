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
//   angular-cli.svg      angular.dev/press-kit, its "Angular logos" folder, SVG files/icon_angular.svg (black symbol), retrieved 2026-11-11; CC BY 4.0, credited on the MCP page
//   supabase-mcp.svg     supabase.com/brand-assets/supabase-icon-green-transparent.svg (green symbol), retrieved 2026-11-11; supabase.com/brand: refer to Supabase only, files and colours unchanged
//   prisma.svg           prisma.io/brand-kit/logo-mark/logo-mark.svg (the symbol), retrieved 2026-11-11; prisma.io/brand-kit lists the symbol for app icons, names no licence and no permission step

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
  'angular-cli': '/mcp-logos/angular-cli.svg',
  'supabase-mcp': '/mcp-logos/supabase-mcp.svg',
  prisma: '/mcp-logos/prisma.svg',
};

export function logoFor(id: string): string | undefined {
  return LOGOS[id];
}
