// Creates a Clover Hosted Checkout session for a pickup order from /order.
// The browser sends item keys and quantities only; prices come from src/data/menu.js here.
//
// Netlify environment variables (Site configuration > Environment variables):
//   CLOVER_MERCHANT_ID    optional; defaults to Polka Deli's merchant ID below
//   CLOVER_PRIVATE_TOKEN  Ecommerce API private token (Settings > Ecommerce > Ecommerce API Tokens)
//   CLOVER_ENV            "production" (default) or "sandbox" for testing
// Without the private token, the function runs in TEST MODE: no payment; the order page emails
// the order to the store (Netlify Forms, marked TEST) and shows the thank-you page.
import { getStore } from '@netlify/blobs';
import { orderItems, fillings, cents, TAX_MD } from '../../src/data/orderItems.js';
import { formatOrder } from '../lib/order-email.mjs';

const byKey = Object.fromEntries(orderItems.map((i) => [i.key, i]));
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const clean = (s, max = 200) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

// Today's date at the store (Eastern time), as YYYY-MM-DD.
const storeDay = (offsetDays = 0) => {
  const d = new Date(Date.now() + offsetDays * 864e5);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(d);
};

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }

  const lang = body.lang === 'pl' ? 'pl' : 'en';
  const type = body.type === 'platters' ? 'platters' : 'deli';

  // Items: check every key, quantity and filling against the menu.
  const lines = [];
  for (const it of Array.isArray(body.items) ? body.items.slice(0, 40) : []) {
    const item = byKey[it.key];
    const qty = Math.floor(Number(it.qty));
    if (!item || item.type !== type || !(qty >= 1 && qty <= 50)) return json({ error: 'items' }, 400);
    let name = item.name;
    if (item.filling) {
      if (!fillings.includes(it.filling)) return json({ error: 'filling' }, 400);
      name += ` (${it.filling})`;
    }
    lines.push({ name, qty, price: cents(item.price) });
  }
  if (!lines.length) return json({ error: 'items' }, 400);

  // Pickup: Silver Spring only. Platters need 24 hours notice (earliest pickup tomorrow).
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return json({ error: 'pickup' }, 400);
  if (date < storeDay(type === 'platters' ? 1 : 0) || date > storeDay(60)) return json({ error: 'pickup' }, 400);

  const customer = { name: clean(body.name, 80), phone: clean(body.phone, 30), email: clean(body.email, 120) };
  if (!customer.name || !customer.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) return json({ error: 'details' }, 400);
  const notes = clean(body.notes, 500);

  const subtotal = lines.reduce((t, l) => t + l.qty * l.price, 0);
  const tax = Math.round(subtotal * TAX_MD);
  const order = { type, date, time, customer, notes, lines, subtotal, tax, total: subtotal + tax, lang, created: new Date().toISOString() };

  const site = new URL(req.url).origin; // the address this request came to (staging or live)
  const thanks = `${site}${lang === 'pl' ? '/pl' : ''}/thanks`;
  const merchant = process.env.CLOVER_MERCHANT_ID || 'XESF2ZXD2SF94'; // Polka Deli's Clover merchant ID (not secret)
  const token = process.env.CLOVER_PRIVATE_TOKEN;

  // TEST MODE: no Clover keys yet. The page emails the order itself (marked not paid)
  // and shows the thank-you page.
  if (!merchant || !token) return json({ test: true, href: `${thanks}?order=test`, total: order.total });

  const host = process.env.CLOVER_ENV === 'sandbox' ? 'https://apisandbox.dev.clover.com' : 'https://api.clover.com';
  const [firstName, ...rest] = customer.name.split(/\s+/);
  const pickupNote = `Pick-up ${date} ${time}, ${customer.name}, ${customer.phone}${notes ? `. Note: ${notes}` : ''}`;
  const res = await fetch(`${host}/invoicingcheckoutservice/v1/checkouts`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      'X-Clover-Merchant-Id': merchant,
    },
    body: JSON.stringify({
      customer: { firstName, lastName: rest.join(' ') || undefined, email: customer.email, phoneNumber: customer.phone.replace(/\D/g, '') },
      shoppingCart: {
        lineItems: lines.map((l, i) => ({
          name: l.name,
          price: l.price,
          unitQty: l.qty,
          // Pickup details ride on the first item so they show on the Clover receipt.
          note: i === 0 ? clean(pickupNote, 250) : undefined,
          taxRates: [{ name: 'MD sales tax', rate: Math.round(TAX_MD * 1e7) }],
        })),
      },
      redirectUrls: { success: `${thanks}?order=paid`, failure: `${site}${lang === 'pl' ? '/pl' : ''}/order?payment=failed` },
    }),
  });
  if (!res.ok) {
    console.error('Clover checkout failed', res.status, await res.text().catch(() => ''));
    return json({ error: 'payment' }, 502);
  }
  const session = await res.json();

  // Keep the order until Clover confirms payment (see clover-webhook.mjs), then email it.
  try {
    await getStore('orders').setJSON(session.checkoutSessionId, { ...order, status: 'awaiting payment' });
  } catch (err) {
    console.error('Could not save order', err); // payment still goes ahead; Clover has the items
  }
  console.log('Checkout created', session.checkoutSessionId, formatOrder(order).split('\n')[0]);
  return json({ href: session.href });
};

export const config = { path: '/api/checkout' };
