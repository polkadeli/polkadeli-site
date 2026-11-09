import { defineConfig } from 'astro/config';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Polish typography: a one-letter word (a, i, o, u, w, z) or a number must not end a line,
// so after building we glue it to the next word with a non-breaking space in the Polish pages.
// Only page text is changed: tags, attributes, scripts and styles are left alone.
const glue = (text) => text
  .replace(/(^|[\s(„"])([aiouwzAIOUWZ])\s+(?=\S)/g, '$1$2&nbsp;')
  .replace(/(^|[\s(–])(\d+)\s+(?=\p{L})/gu, '$1$2&nbsp;');

const polishNbsp = {
  name: 'polish-nbsp',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const walk = async (d) => {
        const entries = await readdir(d, { withFileTypes: true }).catch(() => []);
        return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.html') ? [join(d, e.name)] : [])))).flat();
      };
      for (const file of await walk(join(fileURLToPath(dir), 'pl'))) {
        const html = await readFile(file, 'utf8');
        const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<textarea[\s\S]*?<\/textarea>|<[^>]+>)/);
        const out = parts.map((p, i) => (i % 2 === 1 ? p : glue(p))).join('');
        if (out !== html) await writeFile(file, out);
      }
    },
  },
};

export default defineConfig({
  site: 'https://www.polkadelimd.com',
  integrations: [polishNbsp],
  // Listen on IPv4 so http://localhost:4321 works in Chrome on macOS
  // (otherwise the dev server may bind only to IPv6 ::1).
  server: { host: '127.0.0.1', port: 4321 },
});
