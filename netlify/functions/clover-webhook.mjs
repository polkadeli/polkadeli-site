// Clover calls this when a Hosted Checkout payment finishes. When it is APPROVED, the saved
// order is emailed to the store marked PAID.
// Set up in Clover: Settings > View all settings > Ecommerce > Hosted Checkout > Webhook URL
//   https://<site>/api/clover-webhook, then Generate the signing secret and save it in Netlify
//   as CLOVER_WEBHOOK_SECRET.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { sendOrderEmail } from '../lib/order-email.mjs';
import { sendCustomerEmail } from '../lib/customer-email.mjs';
import { printOrder } from '../lib/clover-print.mjs';

const ok = (msg = 'ok') => new Response(msg, { status: 200 });

// Header looks like: t=1700000000,v1=<hex hmac of "t.body">
const validSignature = (header, raw, secret) => {
  const parts = Object.fromEntries(String(header || '').split(',').map((p) => p.trim().split('=')));
  if (!parts.t || !parts.v1) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex'));
  const given = Buffer.from(parts.v1);
  return expected.length === given.length && timingSafeEqual(expected, given);
};

// Remember what happened to the last webhook call (no secrets, no customer data), so it can be
// checked by opening /api/clover-webhook in a browser.
const note = async (result) => {
  try { await getStore('orders').setJSON('_last-webhook', { at: new Date().toISOString(), result }); } catch {}
};

export default async (req) => {
  if (req.method === 'GET') {
    const last = await getStore('orders').get('_last-webhook', { type: 'json' }).catch(() => null);
    return new Response(JSON.stringify(last || { result: 'no webhook received yet' }), { headers: { 'content-type': 'application/json' } });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const raw = await req.text();
  const secret = (process.env.CLOVER_WEBHOOK_SECRET || '').trim();
  if (!secret || !validSignature(req.headers.get('clover-signature'), raw, secret)) {
    console.warn('Clover webhook: bad or missing signature');
    await note(!secret ? 'no secret saved in Netlify' : req.headers.get('clover-signature') ? 'signature did not match the saved secret' : 'no signature header');
    return new Response('Unauthorized', { status: 401 });
  }
  let event;
  try { event = JSON.parse(raw); } catch { return new Response('Bad request', { status: 400 }); }
  // Clover's field names vary in case and nesting, so look through the whole message.
  const strings = [];
  const keys = [];
  const walk = (v, path) => {
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { keys.push(path + k); walk(x, `${path}${k}.`); }
    else if (typeof v === 'string') strings.push([path.slice(0, -1), v]);
  };
  walk(event, '');
  const pick = (name) => strings.find(([k]) => k.split('.').pop().toLowerCase() === name)?.[1];
  const status = String(pick('status') ?? '').toUpperCase();
  if (status !== 'APPROVED') { await note(`ignored: status ${status || 'none'}; fields ${keys.join(',')}`); return ok('ignored'); }

  // The checkout session id is whichever value in the message matches an order we saved.
  const store = getStore('orders');
  let sessionId; let order;
  for (const [, v] of strings) {
    if (!/^[0-9a-f-]{20,}$/i.test(v)) continue;
    const o = await store.get(v, { type: 'json' }).catch(() => null);
    if (o) { sessionId = v; order = o; break; }
  }
  if (!order) { console.warn('Clover webhook: no saved order matched'); await note(`no saved order matched; fields ${keys.join(',')}`); return ok('unknown'); }
  if (order.status === 'paid') return ok('already done');

  const site = new URL(req.url).origin; // the address this request came to (staging or live)
  await sendOrderEmail(site, order, `PAID online (Clover payment ${pick('id') ?? ''})`);
  await store.setJSON(sessionId, { ...order, status: 'paid', paidAt: new Date().toISOString() });
  await note('order emailed');

  // The customer's own confirmation email (ours, instead of Clover's plain receipt).
  try {
    const sent = await sendCustomerEmail(order, site);
    console.log('Customer email:', sent);
  } catch (e) {
    console.error('Customer email failed:', e.message);
  }

  // Print the order on the Clover Station. A failure here never blocks the email above.
  try {
    const printed = await printOrder(order, pick('id'));
    console.log('Clover print:', JSON.stringify(printed));
  } catch (e) {
    console.error('Clover print failed:', e.message);
  }
  return ok();
};

export const config = { path: '/api/clover-webhook' };
