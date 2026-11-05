// Clover calls this when a Hosted Checkout payment finishes. When it is APPROVED, the saved
// order is emailed to the store marked PAID.
// Set up in Clover: Settings > View all settings > Ecommerce > Hosted Checkout > Webhook URL
//   https://<site>/api/clover-webhook, then Generate the signing secret and save it in Netlify
//   as CLOVER_WEBHOOK_SECRET.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { sendOrderEmail } from '../lib/order-email.mjs';

const ok = (msg = 'ok') => new Response(msg, { status: 200 });

// Header looks like: t=1700000000,v1=<hex hmac of "t.body">
const validSignature = (header, raw, secret) => {
  const parts = Object.fromEntries(String(header || '').split(',').map((p) => p.trim().split('=')));
  if (!parts.t || !parts.v1) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex'));
  const given = Buffer.from(parts.v1);
  return expected.length === given.length && timingSafeEqual(expected, given);
};

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const raw = await req.text();
  const secret = process.env.CLOVER_WEBHOOK_SECRET;
  if (!secret || !validSignature(req.headers.get('clover-signature'), raw, secret)) {
    console.warn('Clover webhook: bad or missing signature');
    return new Response('Unauthorized', { status: 401 });
  }
  let event;
  try { event = JSON.parse(raw); } catch { return new Response('Bad request', { status: 400 }); }
  const status = String(event.status ?? event.Status ?? '').toUpperCase();
  const sessionId = event.data ?? event.Data;
  if (status !== 'APPROVED' || !sessionId) return ok('ignored');

  const store = getStore('orders');
  const order = await store.get(sessionId, { type: 'json' });
  if (!order) { console.warn('Clover webhook: no saved order for', sessionId); return ok('unknown'); }
  if (order.status === 'paid') return ok('already done');

  const site = new URL(req.url).origin; // the address this request came to (staging or live)
  await sendOrderEmail(site, order, `PAID online (Clover payment ${event.id ?? event.Id ?? ''})`);
  await store.setJSON(sessionId, { ...order, status: 'paid', paidAt: new Date().toISOString() });
  return ok();
};

export const config = { path: '/api/clover-webhook' };
