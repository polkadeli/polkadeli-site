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

## Online pickup ordering (Clover Hosted Checkout)

- Order page: `/order` (`src/components/OrderForm.astro`). Items and prices come from `src/data/menu.js`.
- `/api/checkout` (`netlify/functions/checkout.mjs`) checks the order, adds MD 6% tax and sends the customer to Clover to pay.
- `/api/clover-webhook` (`netlify/functions/clover-webhook.mjs`) emails paid orders to the store via the Netlify form `pickup-order`.
- Netlify environment variables: `CLOVER_PRIVATE_TOKEN`, `CLOVER_WEBHOOK_SECRET` (both secret). Without the token the page runs in test mode (no payment).
- Clover dashboard > Settings > Ecommerce > Hosted Checkout: Success URL `/thanks?order=paid`, Failure URL `/order?payment=failed`, Cancel URL `/order`, Webhook URL `/api/clover-webhook`. Switch these to polkadelimd.com at launch.
