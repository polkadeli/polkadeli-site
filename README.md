# Polka Deli website

The website for Polka Deli, Polish Food & Market in Silver Spring, MD (polkadelimd.com).

Built with [Astro](https://astro.build) and deployed on Netlify from the `main` branch.

- Business details (address, hours, phone, links): `src/data/site.js`
- Pages: `src/pages/`
- Shared header and footer markup: `src/layouts/Base.astro`
- Stylesheets in `src/styles/`:
  - `tokens.css`: brand colors, fonts, sizes and spacing (change the look here)
  - `base.css`: page defaults and helpers
  - `header.css`, `footer.css`: shared header, mobile menu and footer
  - `home.css`: homepage only (one stylesheet per page as pages are added)
- Redirects from the old Wix addresses: `netlify.toml`

Run locally: `npm install`, then `npm run dev`.
