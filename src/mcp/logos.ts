// Logos for the verified servers, by catalog id. Each file in public/mcp-logos/
// came from the source named below; the catalog itself carries no logo.
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
//
// Added 2026-11-13, one file per vendor, shared by every server of that vendor. Sources were
// chosen for ease, not for being official; each line says which kind it is. Files are unmodified
// unless noted. None of these sources asks for a credit line, so the MCP page footnote is unchanged.
//
//   aws.svg              OFFICIAL. d1.awsstatic.com .../architecture-icon-release/Icon-package_07312026 .zip (link on aws.amazon.com/architecture/icons), Architecture-Group-Icons_07312026/AWS-Cloud-logo_32.svg. The AWS logo is the lettering with the smile; AWS publishes no separate symbol. Page names no licence; it says customers and partners may use the icons to build architecture diagrams
//   azure.svg            THIRD-PARTY. commons.wikimedia.org/wiki/File:Microsoft_Azure.svg (Microsoft's 2021 Azure logo). Commons tags it public domain, restriction: trademarked
//   google-cloud.svg     THIRD-PARTY. commons.wikimedia.org/wiki/File:Google_Cloud_icon_(2026).svg, whose description says it is the current Google Cloud logo, in use since 2026-05-19. Commons tags it public domain, restriction: trademarked. The file embeds one base64 PNG for its gradient (decoded and checked)
//   firebase.svg         OFFICIAL. firebase.google.com/static/downloads/brand-guidelines/firebase-brand-assets.zip, Primary Logomark/SVG/Logomark_Full Color.svg. The guidelines allow the logomark alone where space is limited, bar the standard lockup in a product; they name no licence and do not mention a catalog tile
//   sentry.svg           OFFICIAL. sentry-brand.storage.googleapis.com/sentry-glyph-black.svg, Sentry's brand bucket; sentry.io/branding offers the same glyph (its logo generator has a Glyph style), but the page does not show this URL, so the URL was found by trying it. The page names no licence. Black as supplied
//   netlify.svg          OFFICIAL. netlify.com/favicon/icon.svg (the site's own icon). Only the width and height attributes changed, 32 to 150, because the tile CSS caps a logo's size but never enlarges it. No licence stated
//   heroku.svg           OFFICIAL. devcenter3.assets.heroku.com/article-images/heroku-logos.zip (linked from devcenter.heroku.com/articles/heroku-brand-guidelines), Heroku Logo Mark/Light/Heroku-Logo-Mark-Light-RGB.svg. Only the viewBox changed, 0 0 720 720 to 290 290 140 140, because the mark filled 16% of the canvas. The guidelines name no licence and say not to suggest sponsorship or endorsement
//   postman.png          OFFICIAL. postman.com/_mk-www-next/icons/android-chrome-512x512.png (the site's app icon, 512 px, transparent corners). No licence stated
//   snyk.png             OFFICIAL, older. docs.snyk.io site icon, 180 px (the Patch dog, in the shield). The current snyk.io icon is the "snyk" wordmark, so this one was chosen to keep to a symbol; Snyk's press-kit page was a contact page with no files. No licence stated
//   shopify.svg          OFFICIAL. cdn.shopify.com/static/brand-assets/shopify-shopping-bag.zip (from shopify.com/brand-assets), 02 - Glyph/svg/shopify_glyph.svg. The page says use of the assets "must be expressly authorized in writing" and points to the Trademark Usage Guidelines
//   mui.svg              OFFICIAL. mui.com/static/logo.svg. No licence stated
//   digitalocean.svg     OFFICIAL. web-platforms.sfo2.cdn.digitaloceanspaces.com/DO Logo Assets.zip (linked from digitalocean.com/press), Logos-RGB/Horizontal/svg/logo-horizontal-black-RGB.svg, black as supplied (the kit has no blue file). Only the viewBox changed, 0 0 416.6 72.8 to 0 0 72.8 72.8, to show the icon without the wordmark. The guidelines say to use the icon alone only where the name is already established on the page, and name no licence
//   clickhouse.svg       OFFICIAL. clickhouse.com/icon0.svg (the site's own icon). No licence stated
//   grafana.svg          OFFICIAL. raw.githubusercontent.com/grafana/grafana/main/public/img/grafana_icon.svg. The repo's licence is AGPL-3.0; it does not name this image
//   vault.svg            OFFICIAL. @hashicorp/flight-icons 3.8.0, svg/vault-color-24.svg, via cdn.jsdelivr.net (the same icon set as the Terraform logo). Package licence MPL-2.0. Only the width and height attributes changed, 24 to 150, for the same reason as netlify.svg
//   sonarqube.png        OFFICIAL. sonarsource.com/app-icon.png (the Sonar mark, 180 px, opaque white background). No licence stated
//   (no markitdown logo: Microsoft's repo and docs carry none)

const MCP = '/mcp-logos/mcp.png';
const AWS = '/mcp-logos/aws.svg';
const GOOGLE_CLOUD = '/mcp-logos/google-cloud.svg';

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
  'aws-documentation': AWS,
  'aws-api': AWS,
  'aws-bedrock-kb': AWS,
  'aws-bedrock-agentcore': AWS,
  'aws-iac': AWS,
  'aws-pricing': AWS,
  'aws-cloudwatch': AWS,
  'aws-dynamodb': AWS,
  'aws-serverless': AWS,
  'aws-eks': AWS,
  'aws-iam': AWS,
  'google-cloud-observability': GOOGLE_CLOUD,
  'google-cloud-storage': GOOGLE_CLOUD,
  'google-cloud-run': GOOGLE_CLOUD,
  'azure-mcp': '/mcp-logos/azure.svg',
  'firebase-mcp': '/mcp-logos/firebase.svg',
  'sentry-mcp': '/mcp-logos/sentry.svg',
  netlify: '/mcp-logos/netlify.svg',
  heroku: '/mcp-logos/heroku.svg',
  'postman-mcp': '/mcp-logos/postman.png',
  snyk: '/mcp-logos/snyk.png',
  'shopify-dev': '/mcp-logos/shopify.svg',
  mui: '/mcp-logos/mui.svg',
  'digitalocean-mcp': '/mcp-logos/digitalocean.svg',
  'clickhouse-mcp': '/mcp-logos/clickhouse.svg',
  'grafana-mcp': '/mcp-logos/grafana.svg',
  'vault-mcp': '/mcp-logos/vault.svg',
  'sonarqube-mcp': '/mcp-logos/sonarqube.png',
};

export function logoFor(id: string): string | undefined {
  return LOGOS[id];
}
