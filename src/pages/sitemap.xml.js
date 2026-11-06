// sitemap.xml for search engines: every public page in English and Polish.
// Add a new page's path here when it is created.
const site = 'https://www.polkadelimd.com';
const pages = ['/', '/deli-menu/', '/platters/', '/shop/', '/find-us/', '/order/'];

export function GET() {
  const urls = pages.flatMap((p) => {
    const en = site + p;
    const pl = site + '/pl' + p;
    const alt = `<xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="pl" href="${pl}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`;
    return [en, pl].map((loc) => `<url><loc>${loc}</loc>${alt}</url>`);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
