import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The home page's proof strip counts the verified MCP servers in the catalog
// this site serves, at build time, so the number never needs editing.
const catalog = JSON.parse(readFileSync(new URL('./public/api/mcp/v1/catalog.json', import.meta.url), 'utf8')) as {
  servers: { tier: string }[]
}
const verifiedMcpServers = catalog.servers.filter((s) => s.tier === 'verified').length

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    __MCP_VERIFIED_COUNT__: JSON.stringify(verifiedMcpServers),
  },
})
