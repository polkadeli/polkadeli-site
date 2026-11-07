// Clover calls this when a Hosted Checkout payment finishes. When it is APPROVED, the saved
// order is emailed to the store marked PAID.
// Set up in Clover: Settings > View all settings > Ecommerce > Hosted Checkout > Webhook URL
//   https://<site>/api/clover-webhook, then Generate the signing secret and save it in Netlify
//   as CLOVER_WEBHOOK_SECRET.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { sendOrderEmail } from '../lib/order-email.mjs';
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
  const status = String(event.status ?? event.Status ?? '').toUpperCase();
  const sessionId = event.data ?? event.Data;
  if (status !== 'APPROVED' || !sessionId) { await note(`ignored: status ${status || 'none'}`); return ok('ignored'); }

  const store = getStore('orders');
  const order = await store.get(sessionId, { type: 'json' });
  if (!order) { console.warn('Clover webhook: no saved order for', sessionId); await note('no saved order for this checkout'); return ok('unknown'); }
  if (order.status === 'paid') return ok('already done');

  const site = new URL(req.url).origin; // the address this request came to (staging or live)
  await sendOrderEmail(site, order, `PAID online (Clover payment ${event.id ?? event.Id ?? ''})`);
  await store.setJSON(sessionId, { ...order, status: 'paid', paidAt: new Date().toISOString() });
  await note('order emailed');

  // Print the order on the Clover Station. A failure here never blocks the email above.
  try {
    const printed = await printOrder(order, event.id ?? event.Id);
    console.log('Clover print:', JSON.stringify(printed));
  } catch (e) {
    console.error('Clover print failed:', e.message);
  }
  return ok();
};

export const config = { path: '/api/clover-webhook' };
