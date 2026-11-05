import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.polkadelimd.com',
  // Listen on IPv4 so http://localhost:4321 works in Chrome on macOS
  // (otherwise the dev server may bind only to IPv6 ::1).
  server: { host: '127.0.0.1', port: 4321 },
});
